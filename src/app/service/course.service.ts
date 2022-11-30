import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from '../model/course.model';
import { Lesson } from '../model/lesson.model';

const baseUrl = 'https://backendcourse.clicoufacil.com';
const baseUrlTeacher = 'https://backendcourse.clicoufacil.com/me/teacher';
const baseUrlStudent = 'https://backendcourse.clicoufacil.com/me/student';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private http: HttpClient) { }

  findAll(): Observable<Course[]> {
    return this.http.get<Course[]>(`${baseUrl}/courses`);
  }

  findOneById(id: number): Observable<any> {
    return this.http.get<any>(`${baseUrl}/courses/${id}`);
  }

  // courses teacher
  findAllCoursesTeacher(): Observable<any> {
    return this.http.get<any>(`${baseUrl}/me/teacher/courses`);
  }

  createNewCourse(course: Course): Observable<any> {
    return this.http.post<any>(`${baseUrl}/me/teacher/courses`, course, { observe: "response" });
  }

  updateCourse(course: Course): Observable<any> {
    return this.http.put<any>(`${baseUrl}/me/teacher/courses/${course.id}`, course, { observe: "response" });
  }

  destroyCourse(courseId:number):Observable<any> {
    return this.http.delete<any>(`${baseUrl}/me/teacher/courses/${courseId}`,{ observe: "response" });
  }

  getCourseByTeacher(id: number): Observable<any> {
    return this.http.get<any>(`${baseUrlTeacher}/courses/${id}`);
  }

  createNewLesson(lesson: Lesson): Observable<any> {
    return this.http.post<any>(`${baseUrlTeacher}/courses/${lesson.course_id}/lesson`, lesson, { observe: "response" });
  }

  updateLesson(lesson: Lesson): Observable<any> {
    return this.http.put<any>(`${baseUrlTeacher}/courses/${lesson.course_id}/lesson/${lesson.id}`, lesson, { observe: "response" });
  }

  destroyLessonCourse(courseId: number, lessonId: number): Observable<any> {
    return this.http.delete<any>(`${baseUrl}/me/teacher/courses/${courseId}/lesson/${lessonId}`);
  }

  // Sevice Estudante

  getCourseStudantById(courseId: number): Observable<any> {
    return this.http.get<any>(`${baseUrlStudent}/courses/${courseId}`)

  }

  getLessonById(lessonId: any): Observable<any> {
    return this.http.get<any>(`${baseUrlStudent}/courses/play/${lessonId}`)
  }

  getCourseById(courseId:number):Observable<any>{
    return this.http.get<any>(`${baseUrl}/courses/${courseId}`);
  }

  buyCourse(courseId:number):Observable<any>{
    return this.http.get<any>(`${baseUrlStudent}/courses/buy/${courseId}`);
  }

  findAllCoursesStudent():Observable<any>{
    return this.http.get<any>(`${baseUrlStudent}/courses/`);
  }
  

}
