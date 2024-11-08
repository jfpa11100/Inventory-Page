import { Component, } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  template: `
    <div class="login-box">
      <h2>Iniciar Sesión</h2>
      <form [formGroup]="loginForm">
        <input type="text" formControlName="username" id="username" placeholder="Nombre de usuario"/>
        <input type="password" formControlName="password" id="password" placeholder="Contraseña"/>
      </form>
      <button (click)="onLogin()" class="primary">Ingresar</button>
      <button [routerLink]="['/sign-up']" class="secondary">Registrarse</button>
    </div>
  `,
})
export class LogInComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private userService: UserService ){
    this.loginForm = this.fb.group({
      username: [''],
      password: ['']  
    })
  }

  async onLogin(){
    let username = this.loginForm.value.username;
    let password = this.loginForm.value.password;

    const {success, message} = await this.userService.logIn(username, password)
    if (success){
      Swal.fire({
        icon: 'success',
        text: 'Ingreso exitoso',
      })
      this.router.navigate(['/home']);
    }
    else{
      Swal.fire({
        icon: 'error',
        text: message,
      })
      return;
    }
  }
}
