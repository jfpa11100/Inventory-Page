import { Component } from '@angular/core';
import { UserService } from '../../../auth/services/user.service';

@Component({
  selector: 'app-new-product',
  standalone: true,
  imports: [],
  template: `
    <section>
      <div>
        <form>
          <input
            type="file"
            name="file"
            id="file"
            (change)="onUpload($event)"
            class="inputfile"
          />
          <label for="file">Seleccionar archivo...</label>
        </form>
      </div>
      <img [src]="uploadedUrl" />
    </section>
  `,
  styleUrl: './new-post.component.css',
})
export class NewPostComponent {
  uploadedUrl = '';

  constructor(){
    
  }

  onUpload(event: Event) {

  }
}
