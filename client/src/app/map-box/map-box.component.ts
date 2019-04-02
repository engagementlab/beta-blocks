import { Component, OnInit, Input } from '@angular/core';
import { MapService } from '../map.service';

import * as mapboxgl from 'mapbox-gl';
import * as _ from 'underscore';
import { Marker } from './marker';

@Component({
  selector: 'map-box',
  templateUrl: './map-box.component.html',
  styleUrls: ['./map-box.component.scss']
})
export class MapBoxComponent implements OnInit {

    
  @Input('mapType') set mapTypeSetter(val: string) {
      this.mapType = val;

      if(!this.ready) return;

      if(this.mapType !== 'default')
        this.updateMap();
  
  };
  @Input() mapData: any[];
  @Input() width: number;
  @Input() height: number;

  // settings
  private mapType: string = 'default';
  private mapBox: mapboxgl.Map;
  private adjacentSrc: mapboxgl.GeoJSONSourceRaw ;

    //   'mapbox://styles/engagementlab/cjt7or6171f3v1flhg6ulw3ta';
  private style: string = 'mapbox://styles/mapbox/light-v10'
  private config: object;

  private ready: boolean;
  private markers: Marker<mapboxgl.Marker> = {};
 
  constructor(private mapService: MapService) {}

  ngOnInit() {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            this.buildMap(position.coords);
        });
    }
    else
        this.buildMap();

    this.ready = true;

  }

  buildMap(userPosition=undefined) {

    let position = (userPosition ? [userPosition.longitude, userPosition.latitude] : [-70.95, 42.35]);
    let lnglat = new mapboxgl.LngLat(position[0], position[1]);
    this.mapBox = new mapboxgl.Map({
        container: 'map',
        style: this.style,
        center: lnglat,
        pitch: 0,
        zoom: 13,
        maxZoom: 16,
   //      minZoom: 11
    });

    this.mapBox.on('load', () => {

        // Add location marker
        if(position) {
            var el = document.createElement('div');
            el.className = 'marker';
            
            new mapboxgl.Marker(el)
                .setLngLat(lnglat)
                .addTo(this.mapBox);
        };
        this.updateMap();

        // if(this.mapType === 'default') return;

        this.mapService.getJSON().subscribe((data: any) => {

            this.mapBox.addSource('shapes', {
                type: 'geojson',
                data: data
            });

            // Create temp source for adjacent hexes and add to map
            this.adjacentSrc = {
                type: 'geojson',
                data: {
                    'type': 'FeatureCollection',
                    'features': []
            }};
            this.mapBox.addSource('adjacent', this.adjacentSrc);

            this.mapBox.on('click', 'defaultLayer', function(e: mapboxgl.MapMouseEvent) {

                var bbox: mapboxgl.Point[] = 
                    [new mapboxgl.Point(e.point.x - 20, e.point.y - 20),
                    new mapboxgl.Point(e.point.x + 20, e.point.y + 20)];

                // Change the cursor style as a UI indicator.
                e.target.getCanvas().style.cursor = 'pointer';

                var features = e.target.queryRenderedFeatures([bbox[0], bbox[1]], {
                    layers: ['defaultLayer']
                });
                
                // Adjust source w/ new box
                (e.target.getSource('adjacent') as mapboxgl.GeoJSONSource).setData({
                    type: 'FeatureCollection',
                    features: features
                });

                let sum = _.reduce(features, (memo, feature) => {
                    return memo + feature.properties.sidewalk;
                }, 0);

                let score = Math.round(sum / features.length);
                // console.log(score, )
                let description = 'Sidewalk average score: ' + (Number.isNaN(score) ? 'No score!' : score);
                document.getElementById('avg').innerText = description;

            });

        });

    });
  }

  updateMap() {

    switch(this.mapType) {
       
        case 'events': 

            for(let event of this.mapData) {

                var el = document.createElement('div');
                el.className = 'marker event';
                let lnglat = new mapboxgl.LngLat(event.lng, event.lat);
                 
                var popup = new mapboxgl.Popup({offset: 25, closeOnClick: true, closeButton: false})
                .setHTML('<h3>' + event.street + '</h3>' + '<br /><i>' + event.date + '</i><br /><a href="'+ event.url + '">More info...</a>');

                let marker = new mapboxgl.Marker(el)
                            .setLngLat(lnglat)
                            .setPopup(popup)
                            .addTo(this.mapBox);

                this.markers[event.id] = marker;
            }

            break;

        case 'exhibit':

                this.mapBox.scrollZoom.disable();
                this.mapBox.setZoom(15);
                this.mapBox.dragPan.disable();

                var el = document.createElement('div');
                el.className = 'marker exhibit';
                let lnglat = new mapboxgl.LngLat(-71.06668400, 42.352264);
                
                var popup = new mapboxgl.Popup({offset: -25, closeOnClick: true, closeButton: false});
                let marker = new mapboxgl.Marker(el)
                            .setLngLat(lnglat)
                            .addTo(this.mapBox);

            break;
    }

    // this.mapBox.setStyle(this.style)
  }

  public move(lat: number, lng: number, id: number=null) {
    
    this.mapBox.flyTo({
        center: [
            lng,
            lat
        ],
        zoom: 15
    });

    if(id) {
        _.each(this.markers, (marker) => {
            marker.getPopup().remove();
        })

        this.markers[id].getPopup().addTo(this.mapBox)
    }

  }

}