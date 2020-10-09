import {
  Component,
  OnInit
} from '@angular/core';

import {
  DataService
} from '../utils/data.service';

import * as AOS from 'aos';
import * as _ from 'underscore';

@Component({
  selector: 'app-exhibit',
  templateUrl: './exhibit.component.html',
  styleUrls: ['./exhibit.component.scss']
})
export class ExhibitComponent implements OnInit {

  public hasContent: boolean;

  public currentEvent: any;
  public nextEvent: any;

  public events: any[];
  public info: any[];

  constructor(private _dataSvc: DataService) {};

  async ngOnInit() {
    const data = await this._dataSvc.getDataForUrl('/api/exhibit/get');

    this.info = data['exhibitData'];
    this.events = data['eventsData'];

    this.currentEvent = _.where(this.events, {
      current: true
    })[0];
    this.nextEvent = _.where(this.events, {
      next: true
    })[0];

    if (this.currentEvent) {
      if (this.currentEvent.endDate2)
        this.currentEvent.displayEndDate = this.currentEvent.endDate2;
      else if (this.currentEvent.endDate)
        this.currentEvent.displayEndDate = this.currentEvent.endDate;
    }
    if (this.nextEvent) {
      if (this.nextEvent.endDate2)
        this.nextEvent.displayEndDate = this.nextEvent.endDate2;
      else if (this.nextEvent.endDate)
        this.nextEvent.displayEndDate = this.nextEvent.endDate;
    }

    this.hasContent = true;


    AOS.init({
      duration: 700,
      easing: 'ease-in-out'
    });

  }

  toggleInfo(evt: Event) {

    let items = document.querySelectorAll('#info ul li');
    _.each(items, (item) => {
      item.classList.remove('active');
    });
    ( < Element > evt.currentTarget).classList.toggle('active');

  }

}