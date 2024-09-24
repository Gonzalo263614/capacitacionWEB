import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isProfilePage: boolean;
  userRole: string | null;

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {
    this.isProfilePage = this.router.url === '/profile';

    // Solo acceder a localStorage si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      const storedRole = localStorage.getItem('userRole');
      this.userRole = storedRole ? storedRole.toLowerCase() : null;
      console.log('Rol del usuario:', this.userRole);
    } else {
      this.userRole = null; // Si no estamos en el navegador
    }

    this.router.events.pipe(filter(() => this.router.url === '/profile')).subscribe(() => {
      this.isProfilePage = true;
    });
    this.router.events.pipe(filter(() => this.router.url !== '/profile')).subscribe(() => {
      this.isProfilePage = false;
    });
  }

  toggleProfile(event: MouseEvent) {
    event.preventDefault();

    if (this.isProfilePage) {
      this.navigateToRolePage();
    } else {
      this.router.navigate(['/profile']);
    }
  }

  navigateToRolePage() {
    switch (this.userRole) {
      case 'administrador':
        this.router.navigate(['/admin']);
        break;
      case 'maestro':
        this.router.navigate(['/maestro']);
        break;
      case 'jefe':
        this.router.navigate(['/jefe']);
        break;
      case 'instructor':
        this.router.navigate(['/instructor']);
        break;
      default:
        console.log('Rol no encontrado, redirigiendo a la página principal.');
        this.router.navigate(['/']);
        break;
    }
  }

  logout() {
    // Implementa aquí tu lógica de cierre de sesión
    this.router.navigate(['/login']);
  }
}
