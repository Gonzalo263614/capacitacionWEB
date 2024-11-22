import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro2',
  templateUrl: './registro2.component.html',
  styleUrl: './registro2.component.css'
})
export class Registro2Component {
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
    if (!this.email || !this.password || !this.confirmPassword || !this.nombre || !this.apellidopaterno || !this.apellidomaterno || !this.rol || !this.curp || !this.rfc || !this.maxestudios || !this.sexo || !this.departamento || !this.tipo_contrato) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, completa todos los campos obligatorios.',
        confirmButtonText: 'Aceptar',
        background: '#f8d7da',
        color: '#721c24',
        confirmButtonColor: '#dc3545'
      });
      return;
    }
  
    if (this.password !== this.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden.',
        confirmButtonText: 'Aceptar',
        background: '#f8d7da',
        color: '#721c24',
        confirmButtonColor: '#dc3545'
      });
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
      sexo: this.sexo,
      departamento: this.departamento,
      tipo_contrato: this.tipo_contrato
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
  
        // Verificar si el error es por correo ya registrado
        if (error.status === 400 && error.error.error === 'El correo ya está registrado.') {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El correo ya está registrado. Por favor, utiliza otro.',
            confirmButtonText: 'Aceptar',
            background: '#f8d7da',
            color: '#721c24',
            confirmButtonColor: '#dc3545'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al registrar el usuario, el correo ya está registrado.',
            confirmButtonText: 'Aceptar',
            background: '#f8d7da',
            color: '#721c24',
            confirmButtonColor: '#dc3545'
          });
        }
      }
    );
  }  
}
