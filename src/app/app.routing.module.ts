import { BodyComponent } from './components/body/body.component';
import { LoginComponent } from "./components/login/login.component";
import {ParentComponent} from './components/parent/parent.component';
import {ContactusComponent} from './components/contactus/contactus.component';
import { MathhistorydetailComponent } from "./components/mathhistorydetail/mathhistorydetail.component";
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';

const routes: Routes = [
  /* default */
  { path: '', redirectTo: '/bornomala', pathMatch: 'full' },
  {path: 'bornomala', component: ParentComponent},
  {path: 'login', component: LoginComponent},
  {path: 'mathHistoryDetail', component: MathhistorydetailComponent},
  {path: 'contactus', component: ContactusComponent}

];

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}


