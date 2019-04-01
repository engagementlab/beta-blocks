import { Component, OnInit } from '@angular/core';

import * as ismobile from 'ismobilejs';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  public isPhone: boolean;

  constructor() {
    
    this.isPhone = ismobile.phone;
  
  }

  ngOnInit() {
  }

}
