import { Injectable, EventEmitter, Output } from '@angular/core';
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  
  
  @Output() changeScreenService: EventEmitter<string> = new EventEmitter();
  @Output() changeLoginParameter: EventEmitter<string> = new EventEmitter();
 
  topicDetailId = new Subject<any>();
  topicDetailId$ = this.topicDetailId.asObservable();

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
  
  changeTopicDetailId(id) {
    this.topicDetailId.next(id);
  }
  
}
