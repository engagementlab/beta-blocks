import { Component, OnInit } from '@angular/core';

import * as ismobile from 'ismobilejs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public isPhone: boolean;

  constructor() {
    
    this.isPhone = ismobile.phone;

  }

  ngOnInit() {
  }

}
