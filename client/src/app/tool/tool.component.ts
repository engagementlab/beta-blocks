import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import * as ismobilejs from 'ismobilejs';
import { DataService } from '../utils/data.service';

@Component({
  selector: 'app-tool',
  templateUrl: './tool.component.html',
  styleUrls: ['./tool.component.scss']
})
export class ToolComponent implements OnInit {

  public url: SafeUrl;
  public isPhone: boolean;
  
  constructor(private _dataSvc: DataService, private _sanitizer: DomSanitizer) {

    this.isPhone = ismobilejs.phone;

    _dataSvc.getDataForUrl('/api/tool/get').subscribe((data: any) => {

      this.url = _sanitizer.bypassSecurityTrustResourceUrl(data.toolData.url);
      
    });


  }

  ngOnInit() {
  }

}
