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
  userRole: string | null; // Se mantiene como string | null

  constructor(private router: Router) {
    this.isProfilePage = this.router.url === '/profile';
    
    // Obtener el rol del usuario desde localStorage
    const storedRole = localStorage.getItem('userRole');
    
  
    // Si el valor no es null, lo convertimos a minúsculas; si es null, lo dejamos como null
    this.userRole = storedRole ? storedRole.toLowerCase() : null; 

    console.log('Rol del usuario:', this.userRole); // Verificar el rol en la consola

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
      // Regresa a la vista dependiendo del rol del usuario
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
        this.router.navigate(['/']); // Redirigir a la página principal si el rol no es válido
        break;
    }
  }

  logout() {
    // Implementa aquí tu lógica de cierre de sesión
    this.router.navigate(['/login']);
  }
}
