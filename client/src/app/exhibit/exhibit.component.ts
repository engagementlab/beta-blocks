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
    // ul.addEventListener('click', function(e){
        // for (let item of items) {
        //   item..remove('active');
        // }
        
        // if (e.target && e.target.nodeName == 'H4') {
           (<Element>evt.currentTarget).classList.add('active')
            // .classList.toggle('active');
        // }
    // });
  }

}
