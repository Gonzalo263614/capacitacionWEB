import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  nombre: string = '';
  apellidopaterno: string = '';
  apellidomaterno: string = '';
  rol: string = '';
  curp: string = '';
  rfc: string = '';
  maxestudios: string = '';

  private apiUrl = 'http://localhost:3000/register'; // URL del endpoint para registrar

  constructor(private http: HttpClient, private router: Router) { }

  register() {
    const user = {
      email: this.email,
      password: this.password,
      nombre: this.nombre,
      apellidopaterno: this.apellidopaterno,
      apellidomaterno: this.apellidomaterno,
      rol: this.rol,
      curp: this.curp,
      rfc: this.rfc,
      maxestudios: this.maxestudios
    };

    this.http.post(this.apiUrl, user).subscribe(
      response => {
        console.log('User registered successfully', response);
        this.router.navigate(['/login']); // Redirige al login después del registro
      },
      error => {
        console.error('Error registering user', error);
      }
    );
  }
}
