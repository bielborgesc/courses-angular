import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../model/user.model';

const baseUrl = 'https://backendcourse.clicoufacil.com'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  login(user: User): Observable<any> {
    return this.http.post(`${baseUrl}/auth/login`, user);
  }

  create(user: any): Observable<any> {
    return this.http.post(`${baseUrl}/auth/register`, user);
  }

}
