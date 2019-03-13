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

  @Input() mapType: string = 'default';
  @Input() width: number;
  @Input() height: number;

  // settings
  private mapBox: mapboxgl.Map;
  private style = 'mapbox://styles/mapbox/streets-v11';
  private config: object;

  constructor(private mapService: MapService) {}

  ngOnInit() {

    switch(this.mapType) {
        case 'sidewalk':
            this.style = 'mapbox://styles/mapbox/light-v9';
            break;
    }

    this.buildMap();

  }

  buildMap() {

    this.mapBox = new mapboxgl.Map({
        container: 'map',
        style: this.style,
        center: [-70.95, 42.35],
        zoom: 11,
        maxZoom: 14,
        minZoom: 11
    });

    this.mapBox.on('load', () => {

        if(this.mapType === 'default') return;

        this.mapService.getJSON().subscribe((data: any) => {

            this.mapBox.addSource('shapes', {
                type: 'geojson',
                data: data
            });

            // Create temp source for adjacent hexes and add to map
            let adjacentSrc = {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': []
                }
            };
            this.mapBox.addSource('adjacent', adjacentSrc);

            this.mapBox.addLayer({
                "id": "defaultLayer",
                "source": "shapes",
                "type": "fill",
                "paint": {
                    'fill-color': [
                        'interpolate',
                        ['linear'],
                        ['get', 'score'],
                        0, '#2e7baf',
                        1083, '#6baabb',
                        2166, '#aed9b9',
                        3249, '#f8eca6',
                        4332, '#ecb24e',
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

            this.mapBox.on('click', 'defaultLayer', function(e) {
                var bbox = [
                    [e.point.x - 30, e.point.y - 30],
                    [e.point.x + 30, e.point.y + 30]
                ];

                // Change the cursor style as a UI indicator.
                e.target.getCanvas().style.cursor = 'pointer';

                var features = e.target.queryRenderedFeatures(bbox, {
                    layers: ['defaultLayer']
                });
                e.target.getSource('adjacent').setData({
                    type: 'FeatureCollection',
                    features: features
                });

                let sum = _.reduce(features, (memo, feature) => {
                    return memo + feature.properties.score;
                }, 0);
                let description = 'Sidewalk average score: ' + (Math.round(sum / features.length) * .001);
                document.getElementById('avg').innerText = description;

            });
            this.mapBox.on('mouseleave', 'defaultLayer', function() {
                popup.remove();
            });

        });

    });
  }

}