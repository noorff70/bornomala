import { Injectable, EventEmitter, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  
  
  @Output() changeScreenService: EventEmitter<string> = new EventEmitter();
  @Output() changeLoginParameter: EventEmitter<string> = new EventEmitter();

  constructor() {
    }
  
  //change screen
  changeCommScreen(screenName) {
    this.changeScreenService.emit(screenName);
  }
  
  //change wanttoregister=false in login component
  changeLogin (status) {
    this.changeLoginParameter.emit(status);
  }
  
}
