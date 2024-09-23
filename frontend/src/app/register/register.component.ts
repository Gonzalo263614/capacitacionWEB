import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
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
    if (this.password !== this.confirmPassword) {
      console.error('Passwords do not match');
      // Aquí puedes mostrar un mensaje de error al usuario
      return;
    }

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
        // Mostrar el alert
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Usuario registrado exitosamente.',
          confirmButtonText: 'Aceptar',
          background: '#f0f0f0', // Cambia el color de fondo
          color: '#333', // Cambia el color del texto
          confirmButtonColor: '#007bff' // Cambia el color del botón
        }).then(() => {
          this.router.navigate(['/login']); // Redirige al login después de cerrar el alert
        });
      },
      error => {
        console.error('Error registering user', error);
      }
    );
  }
}
