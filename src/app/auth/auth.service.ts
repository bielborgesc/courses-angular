import { Injectable, EventEmitter } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import jwtDecode from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public jwtHelper: JwtHelperService) {}

  emitAuthenticationStatus = new EventEmitter<boolean>()

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    const status = !this.jwtHelper.isTokenExpired(token!)
    this.emitAuthenticationStatus.emit(status);
    return status;
  }

  public isTeacher(): boolean {
    const token = localStorage.getItem('token');
    if(token) {
      const tokenObj: any = jwtDecode(token);
      const isTeacher = <boolean>tokenObj.isTeacher;
      return isTeacher;
    }else{
      return false;
    }
  }

}
