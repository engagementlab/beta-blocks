import { Component, OnInit } from '@angular/core';

import * as ismobilejs from 'ismobilejs';

@Component({
  selector: 'app-tool',
  templateUrl: './tool.component.html',
  styleUrls: ['./tool.component.scss']
})
export class ToolComponent implements OnInit {

  public isPhone: boolean;
  
  constructor() {

    this.isPhone = ismobilejs.phone;

  }

  ngOnInit() {
  }

}
