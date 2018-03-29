import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class CommunicationService {


  screenName = new Subject<any>();
  screenName$ = this.screenName.asObservable();

  setCurrentScreen (screen: string) {
    this.screenName.next(screen);
  }

}
