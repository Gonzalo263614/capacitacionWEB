import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-curso-detalle',
  templateUrl: './curso-detalle.component.html',
  styleUrls: ['./curso-detalle.component.css']
})
export class CursoDetalleComponent implements OnInit {
  curso: any;  // Datos del curso
  maestros: any[] = [];  // Lista de maestros inscritos
  error: string = '';  // Para manejar errores
  showCurso: boolean = false;  // Control para mostrar u ocultar detalles del curso
  showMaestros: boolean = false;  // Control para mostrar u ocultar la lista de maestros
  showPasarLista: boolean = false;  // Control para mostrar u ocultar el pase de lista

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const cursoId = this.route.snapshot.paramMap.get('id');  // Obtiene el ID del curso de la URL

    // Obtener los detalles del curso
    this.http.get<any>(`http://localhost:3000/curso/${cursoId}`)
      .subscribe({
        next: (response) => {
          this.curso = response;  // Almacena los detalles del curso

          // Obtener los maestros inscritos en este curso
          this.http.get<any[]>(`http://localhost:3000/curso/${cursoId}/maestros`)
            .subscribe({
              next: (maestros) => {
                // Agrega una propiedad para la asistencia
                this.maestros = maestros.map(maestro => ({
                  ...maestro,
                  asistio: false  // Inicialmente, nadie ha asistido
                }));
                console.log('Maestros obtenidos:', this.maestros);  // Log para verificar
              },
              error: (err) => {
                console.error('Error al obtener los maestros:', err);
                this.error = 'Error al obtener los maestros. Inténtalo de nuevo más tarde.';
              }
            });
        },
        error: (err) => {
          console.error('Error al obtener los detalles del curso:', err);
          this.error = 'Error al obtener los detalles del curso. Inténtalo de nuevo más tarde.';
        }
      });
  }

  // Método para alternar la visibilidad de los detalles del curso
  toggleCurso(): void {
    this.showCurso = !this.showCurso;
  }

  // Método para alternar la visibilidad de la lista de maestros
  toggleMaestros(): void {
    this.showMaestros = !this.showMaestros;
  }

  // Método para mostrar/ocultar el pase de lista
  togglePasarLista(): void {
    this.showPasarLista = !this.showPasarLista;
  }

  // Método para verificar si ya se ha pasado lista ese día
  verificarAsistenciaYaPasada(): void {
    const cursoId = this.route.snapshot.paramMap.get('id');
    const fechaHoy = new Date().toISOString().split('T')[0]; // Obtener la fecha de hoy en formato YYYY-MM-DD

    // Hacer una solicitud para verificar si ya hay registros de asistencia
    this.http.get<any>(`http://localhost:3000/curso/${cursoId}/asistencias?fecha=${fechaHoy}`)
      .subscribe({
        next: (response) => {
          if (response.existe) {
            alert('Ya se ha pasado lista este día. No se puede volver a pasar lista.');
          } else {
            this.guardarAsistencias(); // Si no existe, guardar asistencias
          }
        },
        error: (err) => {
          console.error('Error al verificar asistencia:', err);
          alert('Error al verificar asistencia. Inténtalo de nuevo más tarde.');
        }
      });
  }

  // Método para guardar asistencias
  guardarAsistencias(): void {
    const cursoId = this.route.snapshot.paramMap.get('id');
    const fechaHoy = new Date().toISOString().split('T')[0];  // Obtener la fecha de hoy en formato YYYY-MM-DD

    // Filtrar solo los maestros que han asistido
    const asistencias = this.maestros.map(maestro => ({
      curso_id: cursoId,
      usuario_id: maestro.id,
      fecha: fechaHoy,
      asistencia: maestro.asistio
    }));

    // Guardar asistencias en la base de datos
    this.http.post(`http://localhost:3000/curso/${cursoId}/guardar-asistencias`, asistencias)
      .subscribe({
        next: () => {
          alert('Asistencias guardadas exitosamente');
        },
        error: (err) => {
          console.error('Error al guardar asistencias:', err);
          alert('Error al guardar asistencias. Inténtalo de nuevo más tarde.');
        }
      });
  }
}
