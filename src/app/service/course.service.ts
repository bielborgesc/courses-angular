import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from '../model/course.model';

const baseUrl = 'https://backendcourse.clicoufacil.com'

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

}
