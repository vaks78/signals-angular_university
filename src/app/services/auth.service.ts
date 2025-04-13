import {computed, effect, inject, Injectable, signal} from "@angular/core";
import {User} from "../models/user.model";
import {environment} from "../../environments/environment.development";
import {Router} from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { USER_STORAGE_KEY } from "../constants";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  router = inject(Router);
  http = inject(HttpClient);

  #user = signal<User | null>(null);
  //user = this.#user.asReadonly();
  isLoggedIn = computed(() => !!this.#user());

  constructor() {
    this.LoadUserFromStorage();
    // Load user from local storage when the service is initialized 
    effect(() => {
      const user = this.#user()
      if (user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      }
      else{
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    });
  }

  async login(email: string, password: string): Promise<User> {
    const login$ = this.http.post<User>(`${environment.apiRoot}/login`, {email, password});
    const user = await firstValueFrom(login$);
    this.#user.set(user);
    //localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    return user;
  }

  logout() {
    this.#user.set(null);
    //localStorage.removeItem(USER_STORAGE_KEY);
    this.router.navigate(['/login']);
  }


  private LoadUserFromStorage() {
    const user = localStorage.getItem(USER_STORAGE_KEY);
    if (user) {
      this.#user.set(JSON.parse(user));
    }
  } 

}
