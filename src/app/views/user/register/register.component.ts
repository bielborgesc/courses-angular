import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { catchError, tap } from 'rxjs';
import { UserService } from '../../../service/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  isLoading: boolean = false;

  formRegister = new FormGroup({
    name: new FormControl('',[Validators.minLength(3), Validators.required]),
    email: new FormControl('', [Validators.email, Validators.required]),
    profession: new FormControl("aluno", []),
    password: new FormControl('', [Validators.required]),
  })

  constructor(
    private userService: UserService,
    private router: Router,
    private toast: NgToastService
  ) { }

  ngOnInit(): void {
  }

  verifyValidTouched(inputName: any) {
    return !this.formRegister.get(inputName)!.valid && this.formRegister.get(inputName)!.touched ;
  }


  setCssErro(inputName: any) {
    return {
      'is-invalid': this.verifyValidTouched(inputName),
    };
  }

  create(): void{
    this.isLoading = true;
    const user = {
      name: this.formRegister.value.name,
      email: this.formRegister.value.email,
      password: this.formRegister.value.password,
      is_teacher: this.formRegister.value.profession === "professor" ? true : false,
    }
    this.userService.create(user)
    .pipe(
      tap( (value) => {
        this.router.navigate(['/login']);
        this.toast.success({detail: "Mensagem de Sucesso", summary: "Conta criada com sucesso", duration: 5000})
        this.isLoading = false;
      }),
      catchError(async () => {
        this.toast.error({detail: "Mensagem de Erro", summary: "Houve um erro ao registrar", duration: 5000})
        this.isLoading = false;
      })
    )
    .subscribe()
  }

}
