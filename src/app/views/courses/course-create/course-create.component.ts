import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { Course } from 'src/app/model/course.model';
import { CourseService } from 'src/app/service/course.service';

@Component({
  selector: 'app-course-create',
  templateUrl: './course-create.component.html',
  styleUrls: ['./course-create.component.css']
})
export class CourseCreateComponent implements OnInit {

  titlePage?: string;

  formCreateUpdateCourse = new FormGroup({
    courseName: new FormControl('', [Validators.required, Validators.minLength(5)]),
    courseDescription: new FormControl('', [Validators.required]),
    coursePrice: new FormControl(0, [Validators.required]),
    courseImage: new FormControl('', [Validators.required]),
  });

  constructor(private courseService: CourseService, private toast: NgToastService, private router: Router) { }

  ngOnInit(): void {
    this.titlePage = "Criar novo curso";
  }

  onSubmit() {
    if (this.formCreateUpdateCourse.valid) {

      const courseName = this.formCreateUpdateCourse.get('courseName')?.value;
      const courseDescription = this.formCreateUpdateCourse.get('courseDescription')?.value;
      const coursePrice = this.formCreateUpdateCourse.get('coursePrice')?.value;
      const courseImage = this.formCreateUpdateCourse.get('courseImage')?.value;

      const newCourse: Course = {
        title: courseName ? courseName : '',
        description: courseDescription ? courseDescription : '',
        price: coursePrice ? coursePrice : 0,
        image_url: courseImage ? courseImage : '',
      }

      this.courseService.createNewCourse(newCourse).subscribe(res => {
        if (res.status == 200) {
          this.toast.success({ detail: "Novo curso", summary: "Novo curso criado com sucesso! Agora adicione as aulas.", duration: 5000 });
          this.router.navigate([`professor/curso/${res.body.id}/aulas`]);
        }
      });

    } else {
      console.log("submit form com erro");
    }
  }

  verifyValidTouched(inputName: any) {
    return !this.formCreateUpdateCourse.get(inputName)!.valid && this.formCreateUpdateCourse.get(inputName)!.value !== '';
  }

  setCssErr(field: string) {
    return {
      'is-invalid': this.verifyValidTouched(field),
    };
  }

}
