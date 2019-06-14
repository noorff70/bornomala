import { Injectable, EventEmitter, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsernameService {
  
  username: string;
  @Output() usernameService: EventEmitter<string> = new EventEmitter();

  constructor() { }
  
  changeUserName(username) {
    this.usernameService.emit(username);
  }
}
