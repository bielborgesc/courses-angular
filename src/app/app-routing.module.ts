import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardTeacherService } from './auth/auth-guard-teacher.service';
import { AuthGuardService } from './auth/auth-guard.service';
import { CourseCreateClassComponent } from './views/courses/course-create-class/course-create-class.component';
import { CourseCreateComponent } from './views/courses/course-create/course-create.component';
import { CourseLessonListComponent } from './views/courses/course-lesson-list/course-lesson-list.component';
import { CourseListSelfComponent } from './views/courses/course-list-self/course-list-self.component';
import { CourseListComponent } from './views/courses/course-list/course-list.component';
import { CoursePurchaseComponent } from './views/courses/course-purchase/course-purchase.component';
import { LoginComponent } from './views/user/login/login.component';
import { RegisterComponent } from './views/user/register/register.component';

const routes: Routes = [
  {
    path: '',
    component: CourseListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'registrar',
    component: RegisterComponent
  },
  {
    path: 'professor/novo-curso',
    component: CourseCreateComponent,
    canActivate: [AuthGuardTeacherService]
  },
  {
    path: 'professor/curso/:id/aulas',
    component: CourseCreateClassComponent,
    canActivate: [AuthGuardTeacherService]
  },
  {
    path: 'aluno/curso/:id/aulas',
    component: CourseLessonListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'aluno/curso/:id/comprar',
    component: CoursePurchaseComponent,
    canActivate: [AuthGuardService]
  },

  {
    path: 'meus-cursos',
    component: CourseListSelfComponent,
    canActivate: [AuthGuardService]
  },

  {
    path: '**',
    redirectTo: '',
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuardService, AuthGuardTeacherService]
})
export class AppRoutingModule { }
