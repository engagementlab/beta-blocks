import { Component, OnInit } from '@angular/core';

import { DataService } from '../utils/data.service';

import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import * as ismobile from 'ismobilejs';

@Component({
  selector: 'app-getinvolved',
  templateUrl: './getinvolved.component.html',
  styleUrls: ['./getinvolved.component.scss']
})

export class GetinvolvedComponent implements OnInit {

  public isPhone: boolean;
  public submitted: boolean;
  public received: boolean;

  public hasContent;
  public events: any[];

  constructor(private _dataSvc: DataService, private _scrollToService: ScrollToService) {

    this.isPhone = ismobile.phone;

    _dataSvc.getDataForUrl('/api/events/get/eventbrite').subscribe((data: any) => {

      this.events = data.eventbrite;
      this.hasContent = true;

    });

  }
  
  ngOnInit() {

  }

}
