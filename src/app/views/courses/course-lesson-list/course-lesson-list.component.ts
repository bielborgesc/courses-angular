import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
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
  

  constructor(private courseService: CourseService, private router: Router, private route: ActivatedRoute) { 

  }

  ngOnInit(): void {
    const courseParamsId = this.route.snapshot.paramMap.get("id");
    if (courseParamsId) {
      this.courseSelectedId = parseInt(courseParamsId);
      this.courseService.getCourseStudantById(this.courseSelectedId).subscribe(response =>{
        if (response.status == 401) {
          console.log("Curso não Adquirido!");
        } else if(response.status == 404) {
          console.log("Curso inexistente!");
        } else {
          this.course=response;
          this.titleCourse=this.course?.title;
        }
      } )
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
