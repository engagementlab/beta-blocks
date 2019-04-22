import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';

import { filter } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  public hideMenu: boolean;

  private currentUrl: string;
  @ViewChild('menu') menu: ElementRef;

  constructor(private _router: Router) { 

    this.hideMenu = (environment.production && !environment.qa) || !environment.dev;

    // Close menu when nav starts
    _router.events.pipe(filter(e => e instanceof NavigationStart)).subscribe(e => {
      this.closeNav();
    });
  
    // Get nav route when nav ends
    _router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(e => {
      this.currentUrl = _router.url;
    });
  
  }

  ngOnInit() {
  }

  openCloseNav() {

    let menuDom = this.menu.nativeElement;

    if(menuDom.classList.contains('show')) {
      this.closeNav();
    }
    else {
      menuDom.classList.remove('hide');
      menuDom.classList.add('show');
      menuDom.style.display = 'flex';
    }

  }

  closeNav() {

    let menuDom = this.menu.nativeElement;

    menuDom.classList.remove('show');
    menuDom.classList.add('hide');

    setTimeout(() => {
      menuDom.style.display = 'none';
    }, 1000);

  }

  public logoClick() {
    
  }

  // Is passed route active?
  itemActive(route: string) {

    return '/'+route == this.currentUrl;

  }

}
