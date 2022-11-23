import { Injectable, EventEmitter } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
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

}
