import { Component, Input, OnInit } from '@angular/core';
import { CourseService } from 'src/app/service/course.service';
import { NgToastService } from 'ng-angular-popup';
import { catchError, delay, EMPTY, finalize, Observable, of, switchMap, take, tap } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import jwtDecode from 'jwt-decode';
import { Router } from '@angular/router';


@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {

  isTeacher?: boolean = false;

  courses$!: Observable<any>;
  titlePage!: string;
  descriptionPage!: string;

  formSearch = new FormGroup({
    courseName: new FormControl(''),
  })


  constructor(
    private courseService: CourseService,
    private toast: NgToastService,
    private router: Router
  ) { }

  ngOnInit(): void {

    const token = localStorage.getItem('token');
    if (token) {
      const tokenObj: any = jwtDecode(token);
      this.isTeacher = <boolean>tokenObj.isTeacher;
    }

    this.onRefresh();
  }

  onRefresh() {

    // Verifica se usuário é professor ou estudante


    if (!this.isTeacher) {
      this.titlePage = "Cursos";
      this.descriptionPage = "Lista de todos os Cursos disponíveis!";
      this.courses$ = this.courseService.findAll().pipe(
        catchError(async (err) => {
          this.toast.error({ detail: "Mensagem de Erro", summary: err.error.message, duration: 5000 })
          return EMPTY;
        })
      );
    } else {
      this.titlePage = "Meus cursos";
      this.descriptionPage = "Aqui estão seus cursos divulgados!";
      this.courses$ = this.courseService.findAllCoursesTeacher().pipe(
        catchError(async (err) => {
          this.toast.error({ detail: "Mensagem de Erro", summary: err.error.message, duration: 5000 });
          return EMPTY;
        })
      )
    }
  }

  handleInputSearch() {
    let courses = this.courses$
    courses
      .pipe(
        tap((courses: any) => {
          if (this.formSearch.value.courseName !== "") this.courses$ = of(courses.filter((course: any) => course.title.includes(this.formSearch.value.courseName)))
          else this.onRefresh()
        }),
      )
      .subscribe();
  }

  btnAccessCourse(courseId: any) {
    if (this.isTeacher) {
      this.router.navigate([`/professor/cursos/${courseId}/aulas`]);
    } else {
      //paulo faz
    }

  }

}
