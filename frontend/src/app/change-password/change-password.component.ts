import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';  // Importar Location

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  userId: string | null = null;
  nuevaContrasena: string = '';
  mensajeExito: string = '';  // Variable para almacenar el mensaje de éxito
  mensajeError: string = '';  // Variable para almacenar el mensaje de error

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private location: Location  // Inyectar el servicio Location
  ) {}

  ngOnInit(): void {
    // Obtener el userId de los parámetros de la ruta
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('userId');
      console.log('User ID:', this.userId);  // Imprime el ID en la consola
    });
  }

  cambiarContrasena(): void {
    if (this.userId && this.nuevaContrasena) {
      console.log('User ID:', this.userId);  // Log para verificar el ID del usuario
      console.log('Nueva Contraseña:', this.nuevaContrasena);  // Log para verificar la nueva contraseña
  
      // Hacer la solicitud PUT para cambiar la contraseña
      this.http.put(`http://localhost:3000/usuarios/${this.userId}/cambiar-contrasena`, {
        nuevaContrasena: this.nuevaContrasena
      }).subscribe(response => {
        console.log('Respuesta del servidor:', response);  // Log de la respuesta del servidor
        // Mostrar mensaje de éxito
        this.mensajeExito = 'Contraseña cambiada exitosamente';
        this.mensajeError = '';  // Limpiar el mensaje de error si hay éxito
      }, error => {
        console.error('Error en la solicitud:', error);  // Log del error
        // Mostrar mensaje de error
        this.mensajeError = 'Hubo un error al cambiar la contraseña. Intenta nuevamente.';
        this.mensajeExito = '';  // Limpiar el mensaje de éxito si hay error
      });
    }
  }

  // Función para volver a la página anterior
  volver(): void {
    this.location.back();  // Usar Location para ir hacia atrás en el historial
  }
}
