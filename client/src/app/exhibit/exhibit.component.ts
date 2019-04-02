import { Component, OnInit } from '@angular/core';

import * as _ from 'underscore';
import { DataService } from '../utils/data.service';

@Component({
  selector: 'app-exhibit',
  templateUrl: './exhibit.component.html',
  styleUrls: ['./exhibit.component.scss']
})
export class ExhibitComponent implements OnInit {

  public events: any[];

  constructor(private _dataSvc: DataService) {
    
    _dataSvc.getDataForUrl('/api/events/get').subscribe((data: any) => {

      this.events = data.events;
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
