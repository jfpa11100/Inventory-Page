import { Component, OnInit, signal } from '@angular/core';
import { UserService } from '../../../auth/services/user.service';
import { Product } from '../../interfaces/product.interface';
import { SupabaseService } from '../../../services/supabase-service.service';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';
import { SearchComponent } from '../../components/search/search.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, SearchComponent, SearchComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  user;
  allProducts: Product[] = [];
  products = signal<Product[]>([]);

  constructor(
    private userService: UserService,
    private supabaseService: SupabaseService
  ) {
    this.user = this.userService.getUser();
  }
  async ngOnInit() {
    const products = await this.supabaseService.getProducts();
    if (products) {
      this.allProducts = products;
      this.products.set(products);
    }
  }

  onSearch(search: string) {
    if (!search) this.products.set(this.allProducts);
    else
      this.products.set(
        this.allProducts.filter((product) =>
          product.name.toLowerCase().includes(search.toLowerCase())
        )
      );
  }

  onFilterChange(filters: { sortOrder: string; category: string }) {
    if (!filters.sortOrder) this.products.set(this.allProducts);
    if (filters.category) this.products.set(
      this.products().filter(
        product => product.category === filters.category
      ))
    else if(filters.sortOrder === 'price-asc')
      this.products.set(this.products().sort((a: Product, b: Product) => {
        if (a.price < b.price) return -1
        else if (a.price > b.price) return 1
        return 0;
      }));
    else if(filters.sortOrder === 'price-desc')
      this.products.set(this.products().sort((a: Product, b: Product) => {
        if (a.price < b.price) return 1
        else if (a.price > b.price) return -1
        return 0;
      }));
  }

  onEdit(productId: string) {}

  onDelete(productId: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Se eliminara el producto y todos sus detalles',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FFD814',
      cancelButtonColor: '#023047',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          this.supabaseService.deleteProduct(productId);
          let products = this.products()
          let index = products.findIndex(
            (product) => product.id === productId
          );
          products.splice(index, 1)
          this.products.set(products);

          index = this.allProducts.findIndex(
            (product) => product.id === productId
          );
          this.allProducts.splice(index, 1);
        } catch {
          Swal.fire({
            icon: 'error',
            title: 'Error interno',
            text: 'No se pudo eliminar el producto',
          });
        }
      }
    });
  }

  onProductClick(productId: string) {}
}
