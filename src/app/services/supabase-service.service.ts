import { Injectable } from '@angular/core';
import { createClient} from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Product } from '../features/interfaces/product.interface';
import { User } from '../auth/interfaces/user.interface';
import { LogInResponse } from '../auth/interfaces/login-response.interface';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  supabase;
  
  constructor() {
    this.supabase = createClient(environment.supabase.URL, environment.supabase.PUBLICKEY)
  }
  
  async getProducts() {
    const {data, error} = await this.supabase
      .from('products')
      .select('*')
    return data
  }

  async getUsers() {
    const {data, error} = await this.supabase
      .from('users')
      .select('*')
    return data
  }

  async createRecord(tableName: string, columns: User | Product){
    return await this.supabase
      .from(tableName)
      .insert([columns])
      .select()
  }

  async uploadPhoto(file:File, fileName:string){
    const { error } = await this.supabase!.storage.from('inventory')
        .upload(`inventory/${fileName}`, file);
    if(error){
      console.error(error);
    }
  }


}
 