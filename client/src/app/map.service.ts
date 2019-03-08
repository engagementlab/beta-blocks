import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
// import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { GeoJson } from './map';
import * as mapboxgl from 'mapbox-gl';
import { Observable, Subject, Subscription } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private http: HttpClient) {
    mapboxgl.accessToken = environment.mapbox.accessToken
  }


  public getJSON(): Observable<any> {
    // return this.http.get("./assets/data2.geojson")
    return this.http.get("http://localhost:3000/api/data/get")
                    .map((res:any) => res.data);

  }
}
