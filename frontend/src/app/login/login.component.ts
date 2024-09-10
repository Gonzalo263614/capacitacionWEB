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

    this.http.post<{ token: string, rol: string }>('http://localhost:3000/login', loginData)
      .subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token);
          if (response.rol === 'maestro') {
            this.router.navigate(['/maestro']);
          } else if (response.rol === 'administrador') {
            this.router.navigate(['/admin']);
          }else if (response.rol === 'instructor') {
            this.router.navigate(['/instructor']);
          }else if (response.rol === 'jefe') {
            this.router.navigate(['/jefe']);
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
