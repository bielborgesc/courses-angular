import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { catchError, Observable, tap } from 'rxjs';
import { Course } from 'src/app/model/course.model';
import { CourseService } from 'src/app/service/course.service';

@Component({
  selector: 'app-course-create',
  templateUrl: './course-create.component.html',
  styleUrls: ['./course-create.component.css']
})
export class CourseCreateComponent implements OnInit {

  titlePage?: string;
  nameButtonForm?:string;
  courseSelected?:Course;

  formCreateUpdateCourse = new FormGroup({
    courseName: new FormControl('', [Validators.required, Validators.minLength(5)]),
    courseDescription: new FormControl('', [Validators.required]),
    coursePrice: new FormControl(0, [Validators.required]),
    courseImage: new FormControl('', [Validators.required]),
  });

  constructor(private courseService: CourseService, private toast: NgToastService, private router: Router, private route:ActivatedRoute) { }

  ngOnInit(): void {

    const paramsCourseId = this.route.snapshot.paramMap.get('id');
    if(paramsCourseId){
      
      this.titlePage = "Editar dados do curso";
      this.nameButtonForm = "Editar";

      this.courseService.findOneById(parseInt(paramsCourseId)).pipe(
        tap(resultTap => {
          this.courseSelected = <Course>resultTap;
          
          this.formCreateUpdateCourse.get('courseName')?.setValue(this.courseSelected.title);
          this.formCreateUpdateCourse.get('courseDescription')?.setValue(this.courseSelected.description);
          this.formCreateUpdateCourse.get('coursePrice')?.setValue(this.courseSelected.price);
          this.formCreateUpdateCourse.get('courseImage')?.setValue(this.courseSelected.image_url);

          console.log(this.courseSelected);
        }),catchError(async (error) =>{
          if(error.status){
            this.toast.error({ detail: "Erro", summary: `status de erro ${error.status}`, duration: 5000 });
          }
        })
      ).subscribe();

    }else{
      this.titlePage = "Criar novo curso";
      this.nameButtonForm = "Criar";
    }

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

      if(this.courseSelected){
        newCourse.id = this.courseSelected.id;        
        this.courseService.updateCourse(newCourse).subscribe(res => {
          if (res.status == 200) {
            this.toast.success({ detail: "Manutenção do curso", summary: "Curso atualizado com sucesso", duration: 5000 });
            this.router.navigate([`professor/curso/${res.body.id}/aulas`]);
          }else{
            this.toast.error({ detail: "Manutenção do curso", summary: "Erro ao atualizar o curso", duration: 5000 });
          }
        })

      }else{
        this.courseService.createNewCourse(newCourse).subscribe(res => {
          if (res.status == 200) {
            this.toast.success({ detail: "Novo curso", summary: "Novo curso criado com sucesso! Agora adicione as aulas.", duration: 5000 });
            this.router.navigate([`professor/curso/${res.body.id}/aulas`]);
          }
        });
      }
    

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
