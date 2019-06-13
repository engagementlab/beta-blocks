import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutComponent } from './about/about.component';
import { ExhibitComponent } from './exhibit/exhibit.component';
import { GetInvolvedComponent } from './getinvolved/getinvolved.component';
import { HomeComponent } from './home/home.component';
import { ToolComponent } from './tool/tool.component';
import { TechComponent } from './tech/tech.component';
import { ZonesComponent } from './zones/zones.component';

let routeList: Routes = [

  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'exhibit', component: ExhibitComponent },
  { path: 'discover', component: ToolComponent },
    
  { path: 'getinvolved', component: GetInvolvedComponent },
  { path: 'explorers', component: GetInvolvedComponent },
  { path: 'tech', component: TechComponent },
  { path: 'zones', component: ZonesComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routeList)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
