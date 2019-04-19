import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutComponent } from './about/about.component';
import { ExhibitComponent } from './exhibit/exhibit.component';
import { ExplorerComponent } from './explorer/explorer.component';
import { GetinvolvedComponent } from './getinvolved/getinvolved.component';
import { HomeComponent } from './home/home.component';
import { ToolComponent } from './tool/tool.component';
import { TechComponent } from './tech/tech.component';
import { ZonesComponent } from './zones/zones.component';

import { environment } from 'src/environments/environment';

let routeList = [

  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'getinvolved', component: GetinvolvedComponent },
  { path: 'exhibit', component: ExhibitComponent },
  { path: 'explore', component: ToolComponent },
  { path: 'explorers', component: ExplorerComponent },
  { path: 'tech', component: TechComponent },
  { path: 'zones', component: ZonesComponent }

]
// In production, for now route all traffic to explorer page
let routeListPreview = [
  { path: '', component: ExplorerComponent }
];

let routes: Routes = routeList;

if(environment.production)
  routes = routeListPreview;

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
