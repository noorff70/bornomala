import {TopicDetail} from '../../models/model';
import {Injectable} from '@angular/core';
import {Http, Headers, Response, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/Rx';

@Injectable()
export class MathdetailService {

  constructor(private http: Http) {}

  getMathDetail(topicsID: any, gradeId: any): Observable<any> {

    return this.http.get('http://localhost:8080/lbmp/mathDetail', {
      params: {
        TOPICDETAILID: topicsID,
        GRADEID: gradeId
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
