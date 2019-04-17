import { Component, OnInit } from '@angular/core';

import { DataService } from '../utils/data.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-exhibit',
  templateUrl: './exhibit.component.html',
  styleUrls: ['./exhibit.component.scss']
})
export class ExhibitComponent implements OnInit {
  
  public hasContent: boolean;

  public currentEvent: any;
  public events: any[];
  public info: any[];

  constructor(private _dataSvc: DataService) {
    
    _dataSvc.getDataForUrl('/api/exhibit/get').subscribe((data: any) => {

      this.info = data.exhibitData;
      this.events = data.eventsData;
      this.currentEvent = _.where(this.events, {current: true})[0];

      this.hasContent = true;

    });

  };

  ngOnInit() {
  }

  toggleInfo(evt: Event) {
    
    let items = document.querySelectorAll('#info ul li');
    _.each(items, (item) => {
      item.classList.remove('active');
    });
    (<Element>evt.currentTarget).classList.toggle('active');

  }

}
