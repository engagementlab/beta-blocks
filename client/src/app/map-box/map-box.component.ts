import {
  Component,
  OnInit
} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import {
  MapService
} from '../map.service';
import {
  GeoJson,
  FeatureCollection
} from '../map';
import {
  map
} from 'rxjs-compat/operator/map';
import * as HexgridHeatmap from 'hexgrid-heatmap';

// import geodata from '../

@Component({
  selector: 'map-box',
  templateUrl: './map-box.component.html',
  styleUrls: ['./map-box.component.scss']
})
export class MapBoxComponent implements OnInit {

  /// default settings
  mapBox: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/light-v9';
  lat = -71.066601;
  lng = 42.352387;
  message = 'Hello World!';

  // data
  source: any;
  markers: any;

  constructor(private mapService: MapService) {}

  ngOnInit() {
    // this.markers = this.mapService.getMarkers()
    this.initializeMap()
  }

  private initializeMap() {
    /// locate the user
    // if (navigator.geolocation) {
    //    navigator.geolocation.getCurrentPosition(position => {
    //     this.lat = position.coords.latitude;
    //     this.lng = position.coords.longitude;
    //   });
    // }

    this.buildMap()

  }

  buildMap() {

    // let data = require('');
    this.mapBox = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      center: [-71.07, 42.35],
      zoom: 13
    });
    this.mapBox.on('mousemove', (e) => {
      // console.log(e.lngLat)
    });
    this.mapBox.on('load', () => {

      this.mapService.getJSON().subscribe((data: any) => {
        console.log(data)
        this.mapBox.addSource('shapes', {
          type: 'geojson',
          data: data
          // cluster: true,
          // clusterMaxZoom: 14, // Max zoom to cluster points on
          // clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
        });

   this.mapBox.addLayer({
          "id": "route",
          "source": "shapes",
          // "type": "fill-extrusion",
          "type": "fill",
          "paint": {
            'fill-color':[
            'interpolate',
            ['linear'],
            ['get', 'sidewalks'],
            0, '#000fff',
            40, '#ff0000'
            ],
            "fill-opacity": .3
          }
        });

        // this.mapBox.addLayer({
        //   id: 'sidewalk-heat',
        //   type: 'heatmap',
        //   source: 'shapes',
        //   paint: {
        //     // increase weight as diameter breast height increases
        //     'heatmap-weight': {
        //       property: 'sidewalks.score',
        //       type: 'exponential',
        //       stops: [
        //         [0, 0],
        //         [10000, 1]
        //       ]
        //     },
        //     // increase intensity as zoom level increases
        //     'heatmap-intensity': 1,
        //     // assign color values be applied to points depending on their density
        //     'heatmap-color': [
        //       'interpolate',
        //       ['linear'],
        //       ['heatmap-density'],
        //       0, 'rgba(236,222,239,0)',
        //       0.2, 'rgb(208,209,230)',
        //       0.4, 'rgb(166,189,219)',
        //       0.6, 'rgb(103,169,207)',
        //       0.8, 'rgb(28,144,153)'
        //     ],
        //     // increase radius as zoom increases
        //     'heatmap-radius': {
        //       stops: [
        //         [1, 15],
        //         [15, 40]
        //       ]
        //     },
        //     // decrease opacity to transition into the circle layer
        //     'heatmap-opacity': {
        //       default: 1,
        //       stops: [
        //         [14, 1],
        //         [15, 1]
        //       ]
        //     },
        //   }
        // }, 'waterway-label');
        
      });

    })
  }

}