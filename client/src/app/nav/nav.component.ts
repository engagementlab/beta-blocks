import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  openCloseNav() {

    document.getElementById('menu-btn').classList.toggle('open');

  }

  public logoClick() {
    
  }

}
