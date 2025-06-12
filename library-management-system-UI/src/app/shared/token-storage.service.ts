import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
   saveToken(token: string) {
    localStorage.setItem('token', token);
   }
getToken() {
    return localStorage.getItem('token');
  }

  clear() {
    localStorage.clear();
  }

  getUserRole(): string {
    const token = this.getToken();
    if (!token) return '';
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload['role'];
  
  }   constructor() { }
}
