import { Injectable, signal, WritableSignal } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { LogInResponse, SignUpResponse } from '../interfaces/login-response.interface';
import { SupabaseService } from '../../services/supabase-service.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private supabaseService: SupabaseService) {}

  currentUser = signal<User>({ name: '', username: '', is_admin:false });

  async logIn(username: string, password: string):Promise<LogInResponse> {
    const users = await this.supabaseService.getUsers()
    
    const user = users?.find(u => u.username === username && u.password === password);
    if (user) {
      this.setUser({_:user.password, ...user})
      return { success: true }
    }
    return { 
      success: false,
      message: 'Credenciales inválidas'
    }
  }

  logout() {
    localStorage.removeItem('userLogged');
    this.currentUser.set({ name: '', username: '', is_admin:false });
  }

  async register(user: User):Promise<SignUpResponse> {
    let message = ''
    const response = await this.supabaseService.createRecord('users', user)
    
    if (response.error){
      if (response.error.code === "23505"){
        message = 'Usuario ya existe';
      }
      return { success: false, message }
    }
      
    const userToSet = { _:user.password, ...user }
    this.setUser(userToSet)
    return { success:true }
  }

  private setUser(user: User) {
    localStorage.setItem('userLogged', JSON.stringify(user));
    this.currentUser.set(user);
  }

  getUser():WritableSignal<User> {
    if (!this.currentUser().username) {
      const userSrt = localStorage.getItem('userLogged');
      if (userSrt) {
        const user = JSON.parse(userSrt);
        this.currentUser.set(user);
      }
    }
    return this.currentUser;
  }

  getInventory() {

  }

  saveProduct() {

  }


  deleteProduct() {

  }

}
