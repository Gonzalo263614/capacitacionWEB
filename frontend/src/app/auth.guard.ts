import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      if (token) {
        // Si hay un token, el usuario está autenticado
        return true;
      } else {
        // Si no hay token, redirigir al login
        this.router.navigate(['/login']);
        return false;
      }
    } else {
      // Si localStorage no está disponible, redirigir al login
      this.router.navigate(['/login']);
      return false;
    }
  }
}
