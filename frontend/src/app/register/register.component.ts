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
  sexo: string = '';
  departamento: string = '';
  tipo_contrato: string = '';  // Nueva propiedad

  private apiUrl = 'http://localhost:3000/register'; // URL del endpoint para registrar

  constructor(private http: HttpClient, private router: Router) { }

  register() {
    if (this.password !== this.confirmPassword) {
      console.error('Passwords do not match');
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
      maxestudios: this.maxestudios,
      tipo_contrato: this.tipo_contrato  // Añadir tipo de contrato
    };

    this.http.post(this.apiUrl, user).subscribe(
      response => {
        console.log('User registered successfully', response);
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Usuario registrado exitosamente.',
          confirmButtonText: 'Aceptar',
          background: '#f0f0f0',
          color: '#333',
          confirmButtonColor: '#007bff'
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error => {
        console.error('Error registering user', error);
      }
    );
  }
}
