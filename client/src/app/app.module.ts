import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToolComponent } from './tool/tool.component';
import { HomeComponent } from './home/home.component';

import { NavComponent } from './nav/nav.component';
import { GetInvolvedComponent } from './getinvolved/getinvolved.component';
import { FooterComponent } from './footer/footer.component';
import { CdnImageComponent } from './utils/cdn-image/cdn-image.component';
import { AboutComponent } from './about/about.component';
import { ExhibitComponent } from './exhibit/exhibit.component';
import { ButtonComponent } from './utils/app-button/button.component';

import { DeviceactionPipe } from './utils/deviceaction.pipe';
import { DataService } from './utils/data.service';
import { LinebreakPipe } from './utils/linebreak.pipe';
import { PrettyUrlPipe } from './utils/pretty-url.pipe';

// NPM
import { Cloudinary as CloudinaryCore } from 'cloudinary-core';
import { CloudinaryConfiguration, CloudinaryModule } from '@cloudinary/angular-5.x';
import cloudinaryConfiguration from './cdn.config';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { ZonesComponent } from './zones/zones.component';
import { TechComponent } from './tech/tech.component';

export const cloudinary = {
  Cloudinary: CloudinaryCore
};
export const config: CloudinaryConfiguration = cloudinaryConfiguration;

@NgModule({
  declarations: [    
    AppComponent,
    CdnImageComponent,
    DeviceactionPipe,
    ToolComponent,
    HomeComponent,
    NavComponent,
    GetInvolvedComponent,
    ButtonComponent,
    FooterComponent,
    LinebreakPipe,
    AboutComponent,
    ExhibitComponent,
    ZonesComponent,
    PrettyUrlPipe,
    TechComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    CloudinaryModule.forRoot(cloudinary, config),
    FormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    ReactiveFormsModule,
    ScrollToModule.forRoot()
  ],
  providers: [
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
