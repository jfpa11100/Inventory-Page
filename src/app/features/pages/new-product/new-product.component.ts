import { Component } from '@angular/core';
import { UserService } from '../../../auth/services/user.service';
import Swal from 'sweetalert2';
import { SupabaseService } from '../../../services/supabase-service.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-new-product',
  standalone: true,
  imports: [],
  templateUrl: 'new-product.component.html',
  styleUrl: './new-product.component.css',
})
export class NewProductComponent {
  uploadedUrl = '';
  user;
  

  constructor(
    private userService: UserService,
    private supaseService: SupabaseService 
  ) {
    this.user = this.userService.getUser();
  }

  onUpload(event: Event) {
    Swal.fire({
      title: 'Cargando...',
      text: 'Por favor espera',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(); // Muestra el indicador de carga
      },
    });

    let inputFile = event.target as HTMLInputElement;
    if (!inputFile.files || inputFile.files.length <= 0) {
      return;
    }
    const file: File = inputFile.files[0];
    const fileName = uuidv4();

    this.supaseService
      .uploadPhoto(file, fileName)
      .then(data => {
        this.uploadedUrl = data!;
        Swal.close();
        inputFile.value = '';
      }).catch(() => {
        Swal.close();
        Swal.fire('Error', 'Ocurrió un error al cargar la foto', 'error');
      });
  }
  onCreate(){

  }
}
