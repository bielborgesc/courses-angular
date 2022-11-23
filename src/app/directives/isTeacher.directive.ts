import { Directive, Renderer2, ElementRef, OnInit } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { AuthService } from '../auth/auth.service';

@Directive({
  selector: '[appAccessIsTeacher]'
})
export class IsTeacherDirective implements OnInit{
  constructor(
    private auth: AuthService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngOnInit() {
    this.auth.emitAuthenticationStatus.subscribe(() => {
      const token = localStorage.getItem('token');
      if(token) {
        const tokenObj: any = jwtDecode(token)
        this.showButtonCreateCourse(<boolean>tokenObj.isTeacher)
      }
      else this.showButtonCreateCourse(false)

    });
  }

  showButtonCreateCourse(isTeacher: boolean) {
    if(isTeacher) this.renderer.setStyle(this.elementRef.nativeElement, 'display', 'block');
    else this.renderer.setStyle(this.elementRef.nativeElement, 'display', 'none');
  }

}
