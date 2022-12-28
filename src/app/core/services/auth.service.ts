import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token!: string;

  constructor() {
  }

  get myToken(): string {
    return this.token;
  }

  login() {
    this.token = "My fake Token";
  }
}
