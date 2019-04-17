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

  constructor(private _dataSvc: DataService) {
    
    this.isPhone = ismobile.phone;
      
    _dataSvc.getDataForUrl('/api/exhibit/get/current').subscribe((data: any) => {

      this.currentEvent = data.eventsData[0];  
      this.hasContent = true;
      // _dataSvc.getDataForUrl('/api/events/get/eventbrite').subscribe((data: any) => {
        
      //   this.events = (data.eventbrite.length > 2) ? data.eventbrite.slice(0, 2) : data.eventbrite;
  
      // });
  

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
