import { BodyComponent } from './components/body/body.component';
import {ParentComponent} from './components/parent/parent.component';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';

const routes: Routes = [
  /* default */
  {path: 'bornomala', component: ParentComponent}

];

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}


