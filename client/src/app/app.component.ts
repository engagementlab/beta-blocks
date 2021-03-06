import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart, RouterEvent } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  public isQABuild: boolean;
  public isKiosk: boolean;
  public onHome: boolean;

  title = 'Beta Blocks';

constructor(private _router: Router, private _titleSvc: Title) {

  this.isQABuild = environment.qa;
  this._titleSvc.setTitle((this.isQABuild ? '(QA) ' : '') + this.title);

 }

 ngOnInit() {

  this._router.events.subscribe((evt: RouterEvent) => {
    
    if (evt && evt instanceof NavigationStart)
      this.onHome = evt.url === '/';

    if (evt && !(evt instanceof NavigationStart)) {
      if(evt.url && evt.url.indexOf('?kiosk') > -1) {
        this.isKiosk = true;
        document.body.classList.add('kiosk');
      }
    
    }

    if (!(evt instanceof NavigationEnd)) {
      return;
    }

    // Always go to top of page
    window.scrollTo(0, 0);

  });

 }

}