import { Component, OnInit } from '@angular/core';
import { CourseService } from 'src/app/service/course.service';
import { NgToastService } from 'ng-angular-popup';
import { catchError, delay, EMPTY, finalize, Observable, of, switchMap, take, tap } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {

  courses$!: Observable<any>;
  formSearch =  new FormGroup({
    courseName: new FormControl(''),
  })


  constructor(
    private courseService: CourseService,
    private toast: NgToastService,
  ) { }

  ngOnInit(): void {
    this.onRefresh();
  }

  onRefresh() {
    this.courses$ = this.courseService.findAll().pipe(
      catchError( async (err) => {
        this.toast.error({detail: "Mensagem de Erro", summary: err.error.message, duration: 5000})
        return EMPTY;
      })
    );
  }

  handleInputSearch(){
    let courses = this.courses$
    courses
      .pipe(
        tap((courses: any) => {
          if(this.formSearch.value.courseName !== "") this.courses$ = of(courses.filter((course: any) => course.title.includes(this.formSearch.value.courseName)))
          else this.onRefresh()
        }),
      )
      .subscribe();
  }

}
