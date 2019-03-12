import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ToolComponent } from './tool/tool.component';
import { HomeComponent } from './home/home.component';
import { GetinvolvedComponent } from './getinvolved/getinvolved.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'getinvolved', component: GetinvolvedComponent },
  { path: 'tool', component: ToolComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
