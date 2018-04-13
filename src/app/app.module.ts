import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { BodyComponent } from './components/body/body.component';

import { HttpModule } from '@angular/http';


import { ParentComponent } from './components/parent/parent.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { MenuService } from './services/menuservice/menu.service';
import { MathdetailComponent } from './components/mathdetail/mathdetail.component';
import { MathjaxComponent } from './common/mathjax/mathjax.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    BodyComponent,
    SidenavComponent,
    ParentComponent,
    HeaderComponent,
    FooterComponent,
    MathdetailComponent,
    MathjaxComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    FormsModule
  ],
  providers: [MenuService],
  bootstrap: [AppComponent]
})
export class AppModule { }
