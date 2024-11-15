import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment.development';
import { Product } from '../features/interfaces/product.interface';
import { User } from '../auth/interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  supabase;

  constructor() {
    this.supabase = createClient(
      environment.URL,
      environment.KEY
    );
  }

  async getProducts() {
    const { data, error } = await this.supabase.from('products').select('*');
    if (error) throw error
    return data;
  }
  async getProduct(id:string) {
    const { data, error } = await this.supabase.from('products').select('*').eq('id', id);
    if (error) throw error
    return data;
  }

  async getUsers() {
    const { data, error } = await this.supabase.from('users').select('*');
    if (error) throw error
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

  async updateRecord(newProduct: Product, productId: string){
    const { data, error } = await this.supabase
    .from('products')
    .update(newProduct) 
    .eq('id', productId)
    .select();

    if (error) {
        throw error;
    }

    return data;
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
