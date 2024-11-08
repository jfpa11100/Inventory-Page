import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../auth/services/user.service';
import { Product } from '../../interfaces/product.interface';
import { SupabaseService } from '../../../services/supabase-service.service';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  user;
  products: Product[] = [];

  constructor(private userService: UserService, private supabaseService:SupabaseService) {
    this.user = this.userService.getUser();
  }
  async ngOnInit(){
    const products = await this.supabaseService.getProducts()
    if (products){
      this.products = products;
      return
    }
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No hay productos en el inventario'
    });
  }

  onEdit(productId: string){

  }
  
  onDelete(productId: string){

  }

  onProductClick(productId: string){

  }

  
}
