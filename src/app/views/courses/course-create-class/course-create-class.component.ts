import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { async, catchError, EMPTY, Observable, switchMap, take, tap } from 'rxjs';
import { Course } from 'src/app/model/course.model';
import { Lesson } from 'src/app/model/lesson.model';
import { CourseService } from 'src/app/service/course.service';
import { ModalService } from 'src/app/service/modal.service';

@Component({
  selector: 'app-course-create-class',
  templateUrl: './course-create-class.component.html',
  styleUrls: ['./course-create-class.component.css']
})
export class CourseCreateClassComponent implements OnInit {

  course: Course = new Course;
  lessons: Lesson[] = [];
  isList = true;
  titlePageForm = 'Nova Aula';

  lessonSelectedToEdit?: Lesson;
  actionComponent = 'add';
  txtBtnSendForm = "Inserir";



  formCreateUpdateClass = new FormGroup({
    classTitle: new FormControl('', [Validators.required, Validators.minLength(5)]),
    classDescription: new FormControl('', [Validators.required]),
    classStep: new FormControl(0, [Validators.required]),
    classUrlVideo: new FormControl('', [Validators.required]),
  });

  constructor(private route: ActivatedRoute, private router: Router, private courseService: CourseService, private modalService: ModalService,
    private toast: NgToastService) { }

  ngOnInit(): void {

    const paramId = this.route.snapshot.paramMap.get('id');
    if (paramId) {
      const courseId = parseInt(paramId);
      this.getCourse(courseId);
    }
  }

  private getCourse(courseId: number) {
    this.courseService.getCourseByTeacher(courseId).pipe(
      tap(resultTap => {
        
        this.lessons = resultTap.lessons;
        this.course = resultTap;
        console.log(this.lessons);

      }),catchError(async (error) =>{
        if(error.status == 401){
          this.toast.error({ detail: "Acesso não autorizado", summary: "Você não tem permissão para editar esse curso!", duration: 5000 });
          this.router.navigate(["/meus-cursos"]);
        }else if(error.status == 404){
          this.toast.error({ detail: "Curso não encontrado", summary: "Ops, parece que a url não existe...", duration: 5000 });
          this.router.navigate(["/meus-cursos"]);
        }else{
          this.toast.error({ detail: "Eita...", summary: "Não consegui identificar o que houve...", duration: 5000 });
          this.router.navigate(["/meus-cursos"]);
        }
      })
    ).subscribe();
  }

  btnDestroyClass(lessonId: any) {
    console.log("Excluir aula " + lessonId);
    const result$ = this.modalService.showConfirm({ title: "Exclusão da aula", msg: "Deseja realmente remover a aula do curso?", okTxt: "Sim, remover!", cancelTxt: "Não" });

    const courseId = this.course.id ? this.course.id : 0;

    result$.asObservable().pipe(
      take(1), switchMap(result => result ?
        this.courseService.destroyLessonCourse(courseId, lessonId)
        : EMPTY
      )
    ).subscribe(sucess => {
      this.toast.success({ detail: "Sucesso", summary: "Aula removida com sucesso", duration: 5000 })
      this.lessons = this.lessons.filter(lesson => lesson.id !== lessonId)
    }, error => {
      this.toast.error({ detail: "Erro", summary: "Erro ao remover aula", duration: 5000 })
      console.log('error');
    })
  }

  btnSendForm() {
    if (this.formCreateUpdateClass.valid) {

      const classTitle = this.formCreateUpdateClass.get('classTitle')?.value;
      const classDescription = this.formCreateUpdateClass.get('classDescription')?.value;
      const classStep = this.formCreateUpdateClass.get('classStep')?.value;
      const classUrlVideo = this.formCreateUpdateClass.get('classUrlVideo')?.value;



      if (this.actionComponent == 'add') {

        const newLesson: Lesson = {
          title: classTitle ? classTitle : '',
          step: classStep ? classStep : 0,
          description: classDescription ? classDescription : '',
          url_video: classUrlVideo ? classUrlVideo : '',
          course_id: this.course.id
        }

        this.courseService.createNewLesson(newLesson).subscribe(res => {
          if (res.status == 200) {
            this.toast.success({ detail: "Nova aula", summary: "Novo aula criada com sucesso! Agora adicione as aulas.", duration: 5000 });
            this.lessons.push({
              id: res.body.id,
              title: res.body.title,
              step: res.body.step,
              description: res.body.description,
              url_video: res.body.url_video,
              createdAt: res.body.createdAt,
              updatedAt: res.body.updatedAt
            });
            this.isList = true;
          }
        });
      } else {
        const updateLesson: Lesson = {
          id: this.lessonSelectedToEdit?.id,
          title: classTitle ? classTitle : '',
          step: classStep ? classStep : 0,
          description: classDescription ? classDescription : '',
          url_video: classUrlVideo ? classUrlVideo : '',
          course_id: this.course.id
        }

        this.courseService.updateLesson(updateLesson).subscribe(res => {
          if (res.status == 200) {
            this.toast.success({ detail: "Aula", summary: "Aula foi atualizada com sucesso", duration: 5000 });
            if (updateLesson.course_id) {
              this.getCourse(updateLesson.course_id);
              this.isList = true;
            }
          } else {
            this.toast.error({ detail: "Erro", summary: "Aula não foi atualizada", duration: 5000 });
          }
        });
      }

    } else {
      console.log("submit form com erro");
    }
  }

  verifyValidTouched(inputName: any) {
    return !this.formCreateUpdateClass.get(inputName)!.valid && this.formCreateUpdateClass.get(inputName)!.value !== '';
  }

  setCssErr(field: string) {
    return {
      'is-invalid': this.verifyValidTouched(field),
    };
  }

  btnShowAddNewClass() {
    this.resetFieldForm();
    this.actionComponent = 'add';
    this.txtBtnSendForm = "Inserir";
    this.isList = false;
  }

  btnCancelOperationForm() {
    this.resetFieldForm();
    this.actionComponent = 'add';
    this.txtBtnSendForm = "Inserir";
    this.isList = true;
  }

  btnEditClass(lessonId: any) {

    const lesson = this.lessons.find(lesson => lesson.id == lessonId);

    if (lesson) {
      this.lessonSelectedToEdit = lesson;
      this.titlePageForm = 'Editar aula';
      this.formCreateUpdateClass.get('classTitle')?.setValue(lesson.title)
      this.formCreateUpdateClass.get('classDescription')?.setValue(lesson.description)
      this.formCreateUpdateClass.get('classStep')?.setValue(lesson.step)
      this.formCreateUpdateClass.get('classUrlVideo')?.setValue(lesson.url_video);
      this.txtBtnSendForm = "Editar";
      this.actionComponent = 'edit';
      this.isList = false;
    } else {
      this.toast.error({ detail: "Erro", summary: "Aula não encontrada", duration: 5000 });
    }
  }

  private resetFieldForm() {
    this.formCreateUpdateClass.get('classTitle')?.setValue('')
    this.formCreateUpdateClass.get('classDescription')?.setValue('')
    this.formCreateUpdateClass.get('classStep')?.setValue(0)
    this.formCreateUpdateClass.get('classUrlVideo')?.setValue('');
  }

  btnEditDataCourse(){
    const paramId = this.route.snapshot.paramMap.get('id');
    this.router.navigate([`/professor/editar-curso/${paramId}`]);
  }

  bntDestroyCourse(){
    this.courseService.destroyCourse(<number>this.course.id).pipe(
      tap(resultTap => {
          if(resultTap){
          this.toast.success({ detail: "Manutenção de cursos", summary: "O curso foi removido com sucesso!", duration: 5000 });
          this.router.navigate(["/meus-cursos"]);
          }
      }),catchError(async (error) =>{
        if(error.status == 401){
          this.toast.error({ detail: "Acesso não autorizado", summary: "Você não tem permissão para excluir esse curso!", duration: 5000 });
          this.router.navigate(["/meus-cursos"]);
        }else if(error.status == 404){
          this.toast.error({ detail: "Curso não encontrado", summary: "Ops, parece que a url não existe...", duration: 5000 });
          this.router.navigate(["/meus-cursos"]);
        }else{
          this.toast.error({ detail: "Eita...", summary: "Não consegui identificar o que houve...", duration: 5000 });
          this.router.navigate(["/meus-cursos"]);
        }
      })
    ).subscribe();
  }

}
