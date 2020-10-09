import {
  Component,
  OnInit
} from '@angular/core';
import {
  DataService
} from '../utils/data.service';

import {
  ScrollToService
} from '@nicky-lenaers/ngx-scroll-to';

import * as AOS from 'aos';

@Component({
  selector: 'app-zones',
  templateUrl: './zones.component.html',
  styleUrls: ['./zones.component.scss']
})
export class ZonesComponent implements OnInit {

  public hasContent: boolean;
  public content: any;

  public locationIndices: Number[] = [1, 2, 3];

  constructor(private _dataSvc: DataService, private _scrollToService: ScrollToService) {

  }

  async ngOnInit() {
    const data = await this._dataSvc.getDataForUrl('/api/zones/get');

    this.hasContent = true;
    this.content = data['zoneData'];

    AOS.init({
      duration: 700,
      easing: 'ease-in-out'
    });

  }

  getLocationInfo(i: number) {

    return {
      name: this.content['location' + i + 'Name'],
      description: this.content['location' + i + 'Description'],
      latlng: this.content['location' + i + 'LatLng']
    };

  }

  goToZone(i: number) {

    this._scrollToService
      .scrollTo({
        target: document.getElementById('zone' + i),
        offset: 0,
        easing: 'easeOutQuint',
        duration: 700
      });

  }

}