import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  private currentUrl: string;

  constructor(private _router: Router) { 
  
    // Get nav route when nav ends
    _router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(e => {
      this.currentUrl = _router.url;
    });
  
  }

  ngOnInit() {
  }

  openCloseNav() {

    if(document.getElementById('menu').classList.contains('show')) {
      document.getElementById('menu').classList.remove('show');
      document.getElementById('menu').classList.add('hide');

    }
    else {
      document.getElementById('menu').classList.remove('hide');
      document.getElementById('menu').classList.add('show');
    }

  }

  public logoClick() {
    
  }

  // Is passed route active?
  itemActive(route: string) {

    return '/'+route == this.currentUrl;

  }

}
