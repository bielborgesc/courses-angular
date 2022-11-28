import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { catchError, tap } from 'rxjs';
import { Course } from 'src/app/model/course.model';
import { CourseService } from 'src/app/service/course.service';

@Component({
  selector: 'app-course-purchase',
  templateUrl: './course-purchase.component.html',
  styleUrls: ['./course-purchase.component.css']
})
export class CoursePurchaseComponent implements OnInit {

  courseName?:string;
  coursePrice?:number;
  countClasses?:number;
  courseDetails?:string;

  courseSelected?:Course;


  
  constructor(private router:Router, private route:ActivatedRoute, private courseService:CourseService, private toast:NgToastService) { }

  ngOnInit(): void {
    
    // pega o parametro id da rota
    const courseParamId = this.route.snapshot.paramMap.get('id');

    if(courseParamId){
      
      this.courseService.getCourseById(parseInt(courseParamId)).pipe(
        tap(resultTap =>{
          // para informações do result da API (que é um curso)
          this.courseSelected = resultTap;
        }),catchError(async (error) => {
          if(error.status == 404){
            this.toast.error({ detail: "Mensagem de Erro", summary: "Curso não encontrado", duration: 5000 });
            this.router.navigate(["/"]);
          }         
        })
      ).subscribe();

    }

  }

  btnBuyCourse(){
    console.log("oi?")
    // Verifica se existe um curso selecionado
    if(this.courseSelected?.id){
      this.courseService.buyCourse(this.courseSelected?.id).pipe(
        tap(resultTap =>{
          // para informações do result da API (que é um curso)

          // Se o curso comprado foi igual ao id retornado, redireciona para rota de assistir as aulas
          if(resultTap.id == this.courseSelected?.id){
            this.router.navigate([`/aluno/curso/${this.courseSelected?.id}/aulas`]);
          }
        }),catchError(async (error) => {
          if(error){
            this.toast.error({ detail: "Mensagem de Erro", summary: "Erro ao comprar o curso" , duration: 5000 });
          }         
        })
      ).subscribe();
    }
   
  }




}
