import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SupabaseService } from '../../../services/supabase-service.service';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {

  route = inject(ActivatedRoute)
  supabaseService = inject(SupabaseService) 

  product!: Product;
  async ngOnInit(){
    const productId = this.route.snapshot.paramMap.get('id');
      await this.supabaseService.getProduct(productId!)
        .then(product => this.product = product[0])
      
  }
}
