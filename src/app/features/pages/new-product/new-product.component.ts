import { Component, inject, OnDestroy, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { v4 as uuid4 } from 'uuid';
import Swal from 'sweetalert2';
import { UserService } from '../../../auth/services/user.service';
import { SupabaseService } from '../../../services/supabase-service.service';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-new-product',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.css',
})
export class NewProductComponent implements OnDestroy {
  uploadedUrl = '';
  user;
  newProductForm!: FormGroup;
  savedProduct = false;
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private userService = inject(UserService);
  private supabaseService = inject(SupabaseService);

  constructor() {
    this.user = this.userService.getUser();
    this.newProductForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      category: [null, Validators.required],
      disponibility: [false, Validators.required],
      price: [null, Validators.required],
      stock: [null, Validators.required],
    });
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
    if (!this.uploadedUrl) {
      Swal.fire({
        icon: 'error',
        text: 'Por favor agregue una imágen del producto',
      });
      return;
    }
    if (!this.newProductForm.valid) {
      Swal.fire({
        icon: 'error',
        text: 'Formulario inválido, completa todos los campos correctamente',
      });
      return;
    }

    const newProduct: Product = {
      id: uuid4(),
      name: this.newProductForm.value.name,
      description: this.newProductForm.value.description,
      category: this.newProductForm.value.category,
      disponibility: this.newProductForm.value.disponibility,
      price: this.newProductForm.value.price,
      stock: this.newProductForm.value.stock,
      image: this.uploadedUrl,
    };
    this.supabaseService
      .createRecord('products', newProduct)
      .then(result => {
        Swal.fire({
          icon: 'success',
          text: 'Producto Guardado',
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
          text: 'Ocurrió un error al guardar el producto',
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
