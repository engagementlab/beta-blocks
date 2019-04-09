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

  constructor(private _dataSvc: DataService, private _scrollToService: ScrollToService) {

    _dataSvc.getDataForUrl('/api/zones/get').subscribe((data: any) => {

      this.hasContent = true;
      this.content = data.zoneData;

    });

  }

  ngOnInit() {
  }

}
