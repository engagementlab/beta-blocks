import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { MapService } from '../map.service';
import { GeoJson, FeatureCollection } from '../map';
import { map } from 'rxjs-compat/operator/map';

// import geodata from '../

@Component({
  selector: 'map-box',
  templateUrl: './map-box.component.html',
  styleUrls: ['./map-box.component.scss']
})
export class MapBoxComponent implements OnInit{

  /// default settings
  mapBox: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = -71.12613597667904;
  lng = 42.28326181842006;
  message = 'Hello World!';

  // data
  source: any;
  markers: any;

  constructor(private mapService: MapService) {
  }

  ngOnInit() {
    // this.markers = this.mapService.getMarkers()
    this.initializeMap()
  }

  private initializeMap() {
    /// locate the user
    if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.mapBox.flyTo({
          center: [this.lng, this.lat]
        })
      });
    }

    this.buildMap()

  }

  buildMap() {

    // let data = require('');
    this.mapBox = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom:20,
      center: [this.lng, this.lat]
    });
    this.mapBox.on('load', () => {

      this.mapService.getJSON().subscribe((data: any) => {
        console.log(data)
        this.mapBox.addSource('shapes', {
          type: 'geojson',
          data: data
        });

      this.mapBox.addLayer({
        "id": "route",
        "type": "line",
        "source": "shapes",
        "layout": {
            "line-join": "round",
            "line-cap": "round"
        },
        "paint": {
            "line-color": "#888",
            "line-width": 8
        }
    });
      });

    })
  }

}