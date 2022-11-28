import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { NgToastService } from 'ng-angular-popup';
import { catchError, EMPTY, Observable, of, tap } from 'rxjs';
import { CourseService } from 'src/app/service/course.service';

@Component({
  selector: 'app-course-list-self',
  templateUrl: './course-list-self.component.html',
  styleUrls: ['./course-list-self.component.css']
})
export class CourseListSelfComponent implements OnInit {

 
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
    this.titlePage = "Meus Cursos";
    if (!this.isTeacher) {
      this.descriptionPage = "Lista de todos os seus cursos";
      this.courses$ = this.courseService.findAllCoursesStudent().pipe(
        catchError(async (err) => {
          this.toast.error({ detail: "Mensagem de Erro", summary: err.error.message, duration: 5000 })
          return EMPTY;
        })
      );
    } else {
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
      this.router.navigate([`/aluno/cursos/${courseId}/aulas`]);
    }
  }

  btnRountingHome(){
    this.router.navigate(["/"]);
  }

}

