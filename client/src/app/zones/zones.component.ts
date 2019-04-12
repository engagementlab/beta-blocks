import { Component, OnInit } from '@angular/core';
import { DataService } from '../utils/data.service';

import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';

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

    _dataSvc.getDataForUrl('/api/zones/get').subscribe((data: any) => {

      this.hasContent = true;
      this.content = data.zoneData;

    });

  }

  ngOnInit() {
  }

  getLocationInfo(i: number) {
    
    return {
      name: this.content['location' + i + 'Name'],
      description: this.content['location' + i + 'Description'],
      address: this.content['location' + i + 'Address']
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