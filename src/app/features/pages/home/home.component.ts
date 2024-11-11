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
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will delete the product and his details',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FFD814',
      cancelButtonColor: '#023047',
      confirmButtonText: 'Yes'
    }).then(result => {
      if (result.isConfirmed){
        try {
          this.supabaseService.deleteProduct(productId)
          const index = this.products.findIndex(product => product.id === productId);
          this.products.splice(index, 1);
        } catch {
          Swal.fire({
            icon: 'error',
            title: 'Error interno',
            text: 'No se pudo eliminar el producto'
          });
        }
      }
    });
  }

  onProductClick(productId: string){

  }

  
}
