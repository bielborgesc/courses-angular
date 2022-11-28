import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { catchError, tap } from 'rxjs';
import { Course } from 'src/app/model/course.model';
import { Lesson } from 'src/app/model/lesson.model';
import { CourseService } from 'src/app/service/course.service';

@Component({
  selector: 'app-course-lesson-list',
  templateUrl: './course-lesson-list.component.html',
  styleUrls: ['./course-lesson-list.component.css']
})
export class CourseLessonListComponent implements OnInit {

  titleCourse?:string;
  course?:Course;
  courseSelectedId?:number;
  

  constructor(private courseService: CourseService, private router: Router, private route: ActivatedRoute, private toast:NgToastService) { 

  }

  ngOnInit(): void {
    const courseParamsId = this.route.snapshot.paramMap.get("id");
    if (courseParamsId) {
      this.courseSelectedId = parseInt(courseParamsId);
      this.courseService.getCourseStudantById(this.courseSelectedId).pipe(
        tap(resultTap =>{
        if(resultTap.id){
          this.course=resultTap;
          this.titleCourse=this.course?.title;
        }
        }),catchError(async (error) => {
          if(error.status == 401){
            this.toast.warning({ detail: "Acesso não autorizado", summary: "Você não tem acesso ao curso", duration: 5000 })
            this.router.navigate([`/aluno/curso/${courseParamsId}/comprar`]);
          }else{
            this.toast.error({ detail: "Mensagem de Erro", summary: "Erro desconhecido", duration: 5000 })
          }         
        })
      ).subscribe();
    } 
    
  }

  btnShowClass(lessonId:any) {
    if (lessonId){
      this.courseService.getLessonById(lessonId).subscribe(response =>{
        if (response.url_video) {
          window.open(response.url_video, '_blank');
        }
      })
      
    }

  }

}
