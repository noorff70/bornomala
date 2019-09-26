import { LoggedUser } from "../../models/model";
import { CommunicationService } from "../../services/common/communication.service";
import { UsernameService } from "../../services/common/username.service";
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  userName: string;
  loggedUser: LoggedUser;
  
  constructor(
    private comService: CommunicationService,
    private userService: UsernameService)
     { }

  ngOnInit() {
    this.retrievefromLocalStorage();
    this.userService.usernameService.subscribe(uname=>{
      this.userName= uname;
    });
  }
  
  openLoginPage() {
    this.comService.changeCommScreen('<app-login></app-login>');
    this.comService.changeLogin(false);
  }
  
  retrievefromLocalStorage() {
    let key = 'user';

    if (typeof localStorage.getItem(key) !== 'undefined') {

      this.loggedUser = JSON.parse(localStorage.getItem(key));

      if (null !== this.loggedUser) {
        this.userName = this.loggedUser.username;
      }

      if (this.userName === null || this.userName === undefined) {
        this.userName = null
      }

    }
  }
  
  signOut() {
    localStorage.removeItem('user');
    this.userName = null;
    this.comService.changeCommScreen('<app-body></app-body>');
  }

}
