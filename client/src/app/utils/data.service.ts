import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Subject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { throwError } from 'rxjs';

import { environment } from '../../environments/environment';

import * as _ from 'underscore';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';
import { Router, NavigationStart } from '@angular/router';

import { isScullyGenerated, TransferStateService } from '@scullyio/ng-lib'

@Injectable()
export class DataService {

  public isLoading: Subject<boolean> = new Subject<boolean>();
  public serverProblem: Subject<boolean> = new Subject<boolean>();

  public previousUrl: string;
  public currentUrl: string;

  private baseUrl: string;

  constructor(private http: HttpClient, private _router: Router,
    private transferState: TransferStateService) { 

  	this.baseUrl = 'https://betablocks.city';

    _router.events.subscribe(event => {
      
      this.currentUrl = this._router.url;
      // Track prior url
      if (event instanceof NavigationStart) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
      }
      
    }); 
  }

  public getDataForUrl(urlParam: string): Promise<unknown> {

    this.isLoading.next(true);
    this.serverProblem.next(false);

    let url = this.baseUrl + urlParam;

    // If scully is building or dev build, cache data from content API in transferstate
    if (!isScullyGenerated()) {
    const content =  new Promise<unknown>((resolve, reject) => {
        
        return this.http.get(url).toPromise().then(res =>{
          console.log(`get data from ${url}`,this.http.get(url))
          // Catch no data as problem on backend
          if (res === null) {
            this.serverProblem.next(true);
            return;
          }

          // Cache result in state
          this.transferState.setState(urlParam, res);
          resolve(res);
          return res;
        })
        .catch((error: any) => {
          reject(error);
          console.error(error)
          this.isLoading.next(false);
          return throwError(error);
        });

      });
      return content;

    } else {
  
      // Get cached state for this key
      const state = new Promise<unknown[]>((resolve, reject) => {
        try {
          this.transferState
          .getState < unknown[] > (urlParam)
          .subscribe(res => {
            resolve(res)
              return res;
            });
        } catch (error) {
          this.isLoading.next(false);
        }
      });
      return state;
    }

  }
  
	
  // public getDataForUrl(urlParam: string): Observable<any> {

  //     this.isLoading.next(true);
  //     this.serverProblem.next(false);

  //     let url = this.baseUrl; 
  //     url += urlParam;
      
  //     return this.http.get(url)
  //     .map((res:any)=> {
        
  //       // Catch no data as problem on backend
  //       if(res === null) {
  //         // this.serverProblem.next(true);
  //         this._router.navigateByUrl('/error');
  //         return;
  //       }

  //       this.isLoading.next(false);
        
  //       return res;
  //     })
  //     .catch((error:any) => { 
  //         this.isLoading.next(false);
  //         return throwError(error);
  //     });

  // }
	
  public sendDataToUrl(urlParam: string, formData: any): Observable<any> {

      this.isLoading.next(true);
      this.serverProblem.next(false);

      let url = this.baseUrl; 
      url += urlParam;
      
      return this.http.post(url, formData)
      .map((res:any)=> {

        this.isLoading.next(false);
        
        return res;
      })
      .catch((error:any) => { 
          this.isLoading.next(false);
          return throwError(error);
      });

  }
  
}
