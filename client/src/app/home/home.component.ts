import { Component, AfterViewInit } from '@angular/core';

import { DataService } from '../utils/data.service';

import * as AOS from 'aos';
import * as _ from 'underscore';
import * as ismobile from 'ismobilejs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {

  public isPhone: boolean;
  public hasContent: boolean;

  public events: any[];
  public currentEvent: any;
  public nextEvent: any;

  constructor(private _dataSvc: DataService) {
    
    this.isPhone = ismobile.phone;
      
    _dataSvc.getDataForUrl('/api/exhibit/get/current').subscribe((data: any) => {

      this.currentEvent = _.where(data.eventsData, {current: true})[0];
      this.nextEvent = _.where(data.eventsData, {current: false})[0];

      this.hasContent = true;
  
    });

  }

  ngOnInit() {
  }


  ngAfterViewInit() {

    AOS.init({
      duration: 700,
      easing: 'ease-in-out'
    });

  }
}
