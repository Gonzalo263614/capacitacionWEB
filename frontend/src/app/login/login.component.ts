import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) { }

  login() {
    const loginData = { email: this.email, password: this.password };
  
    this.http.post<{ token: string, rol: string, id: number }>('http://localhost:3000/login', loginData)
      .subscribe({
        next: (response) => {
          // Guardar el token en localStorage
          localStorage.setItem('token', response.token);
  
          // Guardar el rol del usuario en localStorage
          localStorage.setItem('userRole', response.rol);
  
          // Guardar el id del usuario en localStorage
          localStorage.setItem('userId', response.id.toString());
  
          // Navegar según el rol del usuario
          if (response.rol === 'maestro') {
            this.router.navigate(['/maestro']);
          } else if (response.rol === 'administrador') {
            this.router.navigate(['/admin']);
          } else if (response.rol === 'instructor') {
            this.router.navigate(['/instructor']);
          } else if (response.rol === 'jefe') {
            this.router.navigate(['/jefe']);
          }else if (response.rol === 'subdirector') {
            this.router.navigate(['/subdirector']);
          }
        },
        error: (err) => {
          console.error('Error en el login', err);
        }
      });
  }  

  goToRegister() {
    this.router.navigate(['/register']); // Redirige a la página de registro
  }
}
