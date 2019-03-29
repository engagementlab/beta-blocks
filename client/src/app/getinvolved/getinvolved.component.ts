import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../utils/data.service';
import { MapBoxComponent } from '../map-box/map-box.component';

import * as ismobile from 'ismobilejs';

@Component({
  selector: 'app-getinvolved',
  templateUrl: './getinvolved.component.html',
  styleUrls: ['./getinvolved.component.scss']
})
export class GetinvolvedComponent implements OnInit {

  public isPhone: boolean;
  public hasContent;
  public events: any[];

  @ViewChild('map') mapBox: MapBoxComponent;

  constructor(private _dataSvc: DataService) {

      this.isPhone = ismobile.phone;
      
      _dataSvc.getDataForUrl('/api/events/get').subscribe((data: any) => {

      this.events = data;
      this.hasContent = true;

    });

   }

  ngOnInit() {
  }

  public clickEvent(e: any) {

    this.mapBox.move(e.lat, e.lng, e.id);
    
  }

}
