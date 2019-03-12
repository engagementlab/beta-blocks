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

  @Input() width: number;
  @Input() height: number;

  /// default settings
  mapBox: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/light-v9';

  // data
  source: any;
  markers: any;

  constructor(private mapService: MapService) {}

  ngOnInit() {

    this.buildMap();

  }

  buildMap() {

    this.mapBox = new mapboxgl.Map({
        container: 'map',
        style: this.style,
        center: [-71.07, 42.35],
        zoom: 13,
        maxZoom: 14,
        minZoom: 11
    });

    this.mapBox.on('load', () => {

        this.mapService.getJSON().subscribe((data: any) => {
            // console.log(data)
            this.mapBox.addSource('shapes', {
                type: 'geojson',
                data: data
                // cluster: true,
                // clusterMaxZoom: 14, // Max zoom to cluster points on
                // clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
            });

            let adjacentSrc = {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': []
                }
            };
            this.mapBox.addSource('adjacent', adjacentSrc);

            this.mapBox.addLayer({
                "id": "sidewalk",
                "source": "shapes",
                "type": "fill",
                "paint": {
                    'fill-color': [
                        'interpolate',
                        ['linear'],
                        ['get', 'score'],
                        0, '#f72923',
                        6500, '#00ab9e'
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

            // Create a popup, but don't add it to the map yet.
            var popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false
            });

            this.mapBox.on('click', 'sidewalk', function(e) {
                var bbox = [
                    [e.point.x - 30, e.point.y - 30],
                    [e.point.x + 30, e.point.y + 30]
                ];

                // Change the cursor style as a UI indicator.
                e.target.getCanvas().style.cursor = 'pointer';
               
                // Populate the popup and set its coordinates
                // based on the feature found.

                var features = e.target.queryRenderedFeatures(bbox, {
                    layers: ['sidewalk']
                });
                e.target.getSource('adjacent').setData({
                    type: 'FeatureCollection',
                    features: features
                });

                let sum = _.reduce(features, (memo, feature) => {
                    return memo + feature.properties.score;
                }, 0);
                let description = 'Sidewalk average score: ' + (Math.round(sum / features.length) * .001);

                popup.setLngLat(e.lngLat)
                    .setHTML(description)
                    .addTo(e.target);

            });
            this.mapBox.on('mouseleave', 'sidewalk', function() {
                popup.remove();
            });

        });

    });
  }

}