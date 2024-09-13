import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isProfilePage: boolean;

  constructor(private router: Router) {
    // Inicializar el estado basado en la URL actual
    this.isProfilePage = this.router.url === '/profile';

    // Suscribirse a los eventos de navegación para actualizar el estado
    this.router.events.pipe(filter(() => this.router.url === '/profile')).subscribe(() => {
      this.isProfilePage = true;
    });
    this.router.events.pipe(filter(() => this.router.url !== '/profile')).subscribe(() => {
      this.isProfilePage = false;
    });
  }

  toggleProfile(event: MouseEvent) {
    event.preventDefault(); // Evita la acción predeterminada del enlace

    if (this.isProfilePage) {
      // Si estás en la página de perfil, simplemente regresa a otra vista
      this.router.navigate(['/']); // Regresa a la página principal o a una página específica
    } else {
      // Si no estás en la página de perfil, navega al perfil
      this.router.navigate(['/profile']);
    }
  }

  logout() {
    // Implementa aquí tu lógica de cierre de sesión
    this.router.navigate(['/']);
  }
}
