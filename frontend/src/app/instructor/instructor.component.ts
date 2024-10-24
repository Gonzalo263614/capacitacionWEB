import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-instructor',
  templateUrl: './instructor.component.html',
  styleUrls: ['./instructor.component.css']
})
export class InstructorComponent implements OnInit {
  curso: any;  // Datos del curso asignado al instructor
  error: string = '';  // Manejo de errores

  constructor(
    private http: HttpClient,
    private router: Router,  // Inyección de Router para redireccionar
    @Inject(PLATFORM_ID) private platformId: Object  // Inyección del identificador de la plataforma
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {  // Verifica si se está ejecutando en el navegador
      const idInstructor = localStorage.getItem('userId');  // Obtiene el ID del instructor del localStorage

      if (idInstructor) {
        // Obtener el curso asignado al instructor
        this.http.get<any>(`http://localhost:3000/instructor/curso/${idInstructor}`)
          .subscribe({
            next: (response) => {
              this.curso = response;  // Asigna los datos del curso
            },
            error: (err) => {
              console.error('Error al obtener el curso:', err);
              this.error = 'Error al obtener el curso. Inténtalo de nuevo más tarde.';
            }
          });
      } else {
        this.error = 'No se encontró el id del instructor en localStorage.';
      }
    } else {
      this.error = 'El almacenamiento local no está disponible en este entorno.';
    }
  }

  // Método para redirigir a la pantalla de detalles del curso
  verDetallesCurso(cursoId: number): void {
    this.router.navigate([`/curso/${cursoId}/detalle`]); // Redirigir al componente del curso
  }
}
