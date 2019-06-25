import { User } from "../../models/model";
import { Injectable } from '@angular/core';
import {Http, Headers, Response, RequestOptions} from '@angular/http';
import { Observable } from "rxjs";

@Injectable()
export class LoginService {

  
  constructor(private http: Http) { }
  
  login (user): Observable<any> {

    return this.http.post('http://localhost:8080/lbmp/loginview' , user

    )
      .map((res: Response) => {
        return res.json();
      })
      .catch(this.handleError);

  }
  
  registerUser (user): Observable<any> {

      return this.http.post('http://localhost:8080/lbmp/insertUser' , user

    )
      .map((res: Response) => {
        return res.json();
      })
      .catch(this.handleError);

  }
  
  
    handleError(error: Response) {
    return Observable.throw(error.json().error || 'Server error');
  }
  
  

}
