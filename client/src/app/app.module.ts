import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapBoxComponent } from './map-box/map-box.component';
import { ToolComponent } from './tool/tool.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { NavComponent } from './nav/nav.component';
import { GetinvolvedComponent } from './getinvolved/getinvolved.component';

@NgModule({
  declarations: [
    AppComponent,
    MapBoxComponent,
    ToolComponent,
    HomeComponent,
    NavComponent,
    GetinvolvedComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
