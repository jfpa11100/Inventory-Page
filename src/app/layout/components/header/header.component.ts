import { Component, Signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../auth/services/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header>
      @if(user().username){
      <nav>
        <ul>
          <li><a [routerLink]="['/home']">Inicio</a></li>
          @if(user().is_admin){
            <li><a [routerLink]="['/new-product']">Nuevo producto</a></li>
          }
          <li><a (click)="logout()">Cerrar sesión</a></li>
        </ul>
      </nav>
      }@else{
        <h1>Inventory</h1>
      }
    </header>
  `,
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  userService: UserService;
  user;
  constructor(private router:Router, private us:UserService){
    this.userService = us;
    this.user = this.userService.getUser();
  }

  logout(){
    this.userService.logout();
    this.user = this.userService.getUser();
    this.router.navigateByUrl('');
  }

}