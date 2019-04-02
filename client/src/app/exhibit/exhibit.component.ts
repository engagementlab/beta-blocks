import { Component, OnInit } from '@angular/core';

import * as _ from 'underscore';

@Component({
  selector: 'app-exhibit',
  templateUrl: './exhibit.component.html',
  styleUrls: ['./exhibit.component.scss']
})
export class ExhibitComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  toggleInfo(evt: Event) {
    
    let items = document.querySelectorAll('#info ul li');
    _.each(items, (item) => {
      item.classList.remove('active');
    });
    (<Element>evt.currentTarget).classList.toggle('active');

  }

}
