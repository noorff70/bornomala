
import {throwError as observableThrowError, Observable} from 'rxjs';
import {Grade} from '../../models/model';
import {Injectable} from '@angular/core';
import {Http, Headers, Response, RequestOptions} from '@angular/http';
// import 'rxjs/add/operator/map'
import 'rxjs/Rx';


@Injectable()
export class MenuService {

  constructor(private http: Http) {
  }

  getLeftMenu(): Observable<any> {
    return this.http.get('http://localhost:8080/lbmp/menu')
      .map((res: Response) => {
        return res.json();
      })
      .catch(this.handleError);

  }

  handleError(error: Response) {
    return observableThrowError(error.json().error || 'Server error');
  }
}

