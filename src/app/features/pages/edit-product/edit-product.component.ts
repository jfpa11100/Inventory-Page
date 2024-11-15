import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { v4 as uuid4 } from 'uuid';
import Swal from 'sweetalert2';
import { UserService } from '../../../auth/services/user.service';
import { SupabaseService } from '../../../services/supabase-service.service';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css',
})
export class EditProductComponent implements OnInit, OnDestroy {
  uploadedUrl = '';
  user;
  EditProductForm!: FormGroup;
  savedProduct = false;
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private supabaseService = inject(SupabaseService);
  product!: Product;

  async ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
      await this.supabaseService.getProduct(productId!)
        .then(product => this.product = product[0])

    this.EditProductForm = this.formBuilder.group({
      name: [this.product.name],
      description: [this.product.description],
      category: [this.product.category],
      disponibility: [this.product.disponibility],
      price: [this.product.price],
      stock: [this.product.stock],
    });
  }

  constructor() {
    this.user = this.userService.getUser();
  }

  ngOnDestroy(): void {
    if (!this.savedProduct) {
      this.supabaseService.deletePhoto(this.uploadedUrl);
    }
  }

  uploadImage(event: Event) {
    let input = event.target as HTMLInputElement;
    if (input.files!.length <= 0) {
      return;
    }
    Swal.fire({
      title: 'Cargando...',
      text: 'Por favor espera',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(null);
      },
    });
    const fileName = uuid4();
    let file: File = input.files![0];
    this.supabaseService
      .uploadPhoto(file, fileName)
      .then(data => {
        this.uploadedUrl = data!;
        Swal.close();
      })
      .catch(error => {
        Swal.close();
        console.error(error);
        Swal.fire({
          icon: 'error',
          text: 'Ocurrió un error',
        });
      });
  }

  onSubmit() {
    const newProduct = {
      id: this.product.id,
      name: this.EditProductForm.value.name || this.product.name,
      description: this.EditProductForm.value.description || this.product.description,
      category: this.EditProductForm.value.category || this.product.category,
      disponibility: this.EditProductForm.value.disponibility || this.product.disponibility,
      price: this.EditProductForm.value.price || this.product.price,
      stock: this.EditProductForm.value.stock || this.product.stock,
      image: this.uploadedUrl || this.product.image,
    };
    this.supabaseService
      .updateRecord(newProduct, this.product.id)
      .then(result => {
        Swal.fire({
          icon: 'success',
          text: 'Producto Actualizado',
          timer: 1500,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        this.savedProduct = true;
        this.router.navigate(['/home']);
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          text: 'Ocurrió un error al guardar los cambios',
        });
      });
  }

  onCancel() {
    this.router.navigate(['/home']);
  }
  deleteImage() {
    this.supabaseService.deletePhoto(this.uploadedUrl);
    this.uploadedUrl = '';
  }
}
