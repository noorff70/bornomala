import { BodyComponent } from './components/body/body.component';
import { LoginComponent } from "./components/login/login.component";
import {ParentComponent} from './components/parent/parent.component';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';

const routes: Routes = [
  /* default */
  {path: 'bornomala', component: ParentComponent},
  {path: 'login', component: LoginComponent}
];

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}


