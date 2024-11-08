import { Component } from '@angular/core';
import { SupabaseService } from '../../../services/supabase-service.service';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent {
  products: Product[] = []

  constructor(supabaseService: SupabaseService){
    console.log(supabaseService.getProducts())
    this.products = []
  }
}
