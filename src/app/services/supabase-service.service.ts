import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Product } from '../features/interfaces/product.interface';
import { User } from '../auth/interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  supabase;

  constructor() {
    this.supabase = createClient(
      environment.supabase.URL,
      environment.supabase.PUBLICKEY
    );
  }

  async getProducts() {
    const { data, error } = await this.supabase.from('products').select('*');
    if (error) throw error
    return data;
  }

  async getUsers() {
    const { data, error } = await this.supabase.from('users').select('*');
    return data;
  }

  async createRecord(tableName: string, columns: User | Product) {
    return await this.supabase.from(tableName).insert([columns]).select();
  }

  async deleteProduct(id: string) {
    const { data, error } = await this.supabase
        .from('products')
        .delete()
        .eq('id', id)
        .select();

    if (error) {
        throw error;
    }
    this.deletePhoto(data[0].imageUrl)
  }

  async uploadPhoto(file: File, fileName: string) {
    const { error } = await this.supabase!.storage.from('inventory').upload(
      `inventory/${fileName}`,
      file
    );
    if (error) throw error 
    const { data } = this.supabase!.storage.from('inventory').getPublicUrl(
      `inventory/${fileName}`
    );
    return data.publicUrl;
  }

  async deletePhoto(imageUrl: string) {
    const id = imageUrl.split('/').slice(-1)[0];
    return await this.supabase!.storage.from('inventory').remove([
      `inventory/${id}`,
    ]);
  }
}
