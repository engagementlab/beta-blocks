import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  public isQABuild: boolean;
  title = 'Beta Blocks';

constructor(private _router: Router, private _titleSvc: Title) {

  this.isQABuild = environment.qa;
  this._titleSvc.setTitle((this.isQABuild ? '(QA) ' : '') + this.title);

 }

 ngOnInit() {

  this._router.events.subscribe((evt) => {

    if (!(evt instanceof NavigationEnd)) {
      return;
    }

    // Always go to top of page
    window.scrollTo(0, 0);

  });

 }

}