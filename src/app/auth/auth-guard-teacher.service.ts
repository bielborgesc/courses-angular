import { Injectable } from '@angular/core';
import { Router, CanActivate} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardTeacherService implements CanActivate{

  constructor(
    public auth: AuthService,
    private router: Router,
  ) {}

  canActivate(): boolean {
    if (!this.auth.isTeacher()) {
        this.router.navigate(['/meuscursos']);
        return false;
      }
      return true;
  }  
}
