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
import { ButtonComponent } from './utils/app-button/button.component';
import { DeviceactionPipe } from './utils/deviceaction.pipe';
import { DataService } from './utils/data.service';
import { FooterComponent } from './footer/footer.component';
import { CdnImageComponent } from './utils/cdn-image/cdn-image.component';

// NPM
import { Cloudinary as CloudinaryCore } from 'cloudinary-core';
import { CloudinaryConfiguration, CloudinaryModule } from '@cloudinary/angular-5.x';
import cloudinaryConfiguration from './cdn.config';
import { LinebreakPipe } from './utils/linebreak.pipe';
import { AboutComponent } from './about/about.component';
import { ExhibitComponent } from './exhibit/exhibit.component';

export const cloudinary = {
  Cloudinary: CloudinaryCore
};
export const config: CloudinaryConfiguration = cloudinaryConfiguration;

@NgModule({
  declarations: [    
    AppComponent,
    CdnImageComponent,
    DeviceactionPipe,
    MapBoxComponent,
    ToolComponent,
    HomeComponent,
    NavComponent,
    GetinvolvedComponent,
    ButtonComponent,
    FooterComponent,
    LinebreakPipe,
    AboutComponent,
    ExhibitComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    CloudinaryModule.forRoot(cloudinary, config),
    HttpClientModule
  ],
  providers: [
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
