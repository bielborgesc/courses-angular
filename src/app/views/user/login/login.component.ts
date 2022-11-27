import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { UserService } from '../../../service/user.service';
import { NgToastService} from 'ng-angular-popup';
import { tap, catchError } from 'rxjs';
import { User } from 'src/app/model/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isLoading: boolean = false;

  formLogin = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  })

  constructor(
    private userService: UserService,
    private router: Router,
    public auth: AuthService,
    private toast: NgToastService,
  ) { }

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['']);
    }
  }

  verifyValidTouched(inputName: any) {
    return !this.formLogin.get(inputName)!.valid && this.formLogin.get(inputName)!.touched ;
  }

  setCssErro(inputName: any) {
    return {
      'is-invalid': this.verifyValidTouched(inputName),
    };
  }

  login(): void{
    this.isLoading = true;
    this.userService.login(<User>this.formLogin.value)
      .pipe(
        tap((value) => {
          localStorage.setItem('token', value.token);
          this.router.navigate(['/']);
          this.toast.success({detail: "Mensagem de Sucesso", summary: "Login realizado com sucesso", duration: 5000})
          this.isLoading = false;
        }),
        catchError(async (err) => {
          console.log(err);
          this.toast.error({detail: "Mensagem de Erro", summary: "Credenciais incorretas", duration: 5000})
          this.isLoading = false;
        })
      )
      .subscribe()
  }
}
