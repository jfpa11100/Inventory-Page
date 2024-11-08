import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  template: `
    <div class="login-box">
        <h2>Registrarse</h2>
        <form [formGroup]="registerForm">
          <input type="text" formControlName="name" id="name" placeholder="Nombre"/>
          <input type="text" formControlName="username" id="username" placeholder="Nombre de usuario"/>
          <input type="password" formControlName="password" id="password" placeholder="Contraseña"/>
          <input type="password" formControlName="rePassword" id="re-password" placeholder="Confirmar contraseña"/>
          <div>
            Administrador
            <input style="margin:0; padding: 0; width: 50px" type="checkbox" formControlName="isAdmin" id="isAdmin" />
          </div>
        </form>
        <button (click)="onRegister()" class="primary">Registrarse</button>
        <a [routerLink]="['/login']" >¿Ya tiene cuenta?</a>
    </div>
  `,
})
export class SignUpComponent {

  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private router:Router, private userService: UserService){
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(30)]],
      username: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(15)]],
      password: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(15)]],  
      rePassword: ['', [Validators.required]],
      isAdmin: [false]
    })

  }

  async onRegister(){
    if(!this.registerForm.valid){
      Swal.fire({
        title: 'Mal registro :(',
        text: 'Digilencia los campos correctamente',
        icon: 'error',
      })
      return;
    }

    const name = this.registerForm.value.name;
    const username = this.registerForm.value.username;
    const password = this.registerForm.value.password;
    const rePassword = this.registerForm.value.rePassword;
    const isAdmin = this.registerForm.value.isAdmin;

    if (password !== rePassword){
      Swal.fire({
        title: 'Las contraseñas :(',
        text: 'No coinciden',
        icon: 'error',
      })
      return
    }

    const response = await this.userService.register({name, username, password, is_admin:isAdmin})
    if (response.success){
      Swal.fire({
        icon: 'success',
        text: 'Usuario agregado exitosamente',
      })
      return
    }
    Swal.fire({
      icon: 'error',
      text: response.message || 'No se pudo crear el usuario',
    })
  }
}
