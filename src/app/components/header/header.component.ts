import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/service/modal.service';
import { delay, EMPTY, switchMap, take, tap } from 'rxjs';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  title = 'Courses';

  constructor(
    private router: Router,
    private modalService: ModalService,
  ) { }

  logout() {
    const result$ = this.modalService.showConfirm({ title: "Confrimação", msg: "Tem certeza que deseja sair?" });
    result$.asObservable()
      .pipe(
        take(1),
        tap((result) => {
          if (result) {
            this.router.navigate(['/login']);
            localStorage.removeItem("token");
          }
        }),
      )
      .subscribe()
  }

  navigateHome() {
    this.router.navigate(['/']);
  }

  navigateToCreateNewCourse() {
    this.router.navigate(['/professor/novo-curso']);
  }

  btnRouterCoursesSelf(){
    this.router.navigate(["/meus-cursos"])
  }

}
