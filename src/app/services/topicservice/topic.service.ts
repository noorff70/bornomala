import { GradeSubject } from '../../models/model';
import {Injectable} from '@angular/core';
import {Http, Headers, Response, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';

@Injectable()
export class TopicService {

  constructor(private http: Http) {}

    getSubMenu(gradeSubject: GradeSubject): Observable<any> {

    return this.http.get('http://localhost:8080/lbmp/subMenu', {
      params: {
        GRADEID: gradeSubject.gradeId,
        SUBJECTID: gradeSubject.subjectId
      }
    })
      .map((res: Response) => {
        return res.json();
      })
      .catch(this.handleError);

  }

  handleError(error: Response) {
    return Observable.throw(error.json().error || 'Server error');
  }

}
