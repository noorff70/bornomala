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
    let key = 'userName';
    this.userName = localStorage.getItem(key);
  }
  
  signOut() {
    localStorage.clear();
    this.userName = null;
    this.comService.changeCommScreen('<app-body></app-body>');
  }

}
