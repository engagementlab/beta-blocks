import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import isMobile from 'ismobilejs';
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

    this.isPhone = isMobile(window.navigator.userAgent).phone;



  }

  async ngOnInit() {
    const data = await this._dataSvc.getDataForUrl('/api/tool/get');
    this.url = this._sanitizer.bypassSecurityTrustResourceUrl(data['toolData'].url);
  }

}
