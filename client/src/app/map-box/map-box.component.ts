import { Component, OnInit, Input } from '@angular/core';
import { MapService } from '../map.service';

import * as mapboxgl from 'mapbox-gl';
import * as _ from 'underscore';

@Component({
  selector: 'map-box',
  templateUrl: './map-box.component.html',
  styleUrls: ['./map-box.component.scss']
})
export class MapBoxComponent implements OnInit {

    
  @Input('mapType') set mapTypeSetter(val: string) {
      this.mapType = val;

      if(this.mapType !== 'default')
        this.updateMap();
  };
  @Input() width: number;
  @Input() height: number;

  // settings
  private mapType: string = 'default';
  private mapBox: mapboxgl.Map;
  private adjacentSrc: mapboxgl.GeoJSONSourceRaw ;

  private style: string = 'mapbox://styles/engagementlab/cjt7or6171f3v1flhg6ulw3ta';
  private config: object;

  constructor(private mapService: MapService) {}

  ngOnInit() {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            this.buildMap(position.coords);
        });
    }
    else
        this.buildMap();

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
        case 'sidewalk':
            this.style = 'mapbox://styles/mapbox/light-v9';

            this.mapBox.addLayer({
                "id": "defaultLayer",
                "source": "shapes",
                "type": "fill",
                "paint": {
                    'fill-color': [
                        'interpolate',
                        ['linear'],
                        ['get', 'sidewalk'],
                        0, '#2e7baf',
                        20, '#6baabb',
                        40, '#aed9b9',
                        60, '#f8eca6',
                        80, '#ecb24e',
                        100, '#00ab9e'
                    ],
                    'fill-outline-color': '#f6a536',
                    "fill-opacity": .4
                }
            });
            this.mapBox.addLayer({
                "id": "highlighted",
                "type": "fill",
                "source": "adjacent",
                "paint": {
                    "fill-outline-color": "#484896",
                    "fill-color": "#6e599f",
                    "fill-opacity": 0.75
                }
            });

            break;
    }

    // this.mapBox.setStyle(this.style)
  }

}