import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutComponent } from './about/about.component';
import { ExhibitComponent } from './exhibit/exhibit.component';
import { GetinvolvedComponent } from './getinvolved/getinvolved.component';
import { HomeComponent } from './home/home.component';
import { ToolComponent } from './tool/tool.component';
import { TechComponent } from './tech/tech.component';
import { ZonesComponent } from './zones/zones.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'exhibit', component: ExhibitComponent },
  { path: 'getinvolved', component: GetinvolvedComponent },
  { path: 'tech', component: TechComponent },
  { path: 'zones', component: ZonesComponent },
  { path: 'tool', component: ToolComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
