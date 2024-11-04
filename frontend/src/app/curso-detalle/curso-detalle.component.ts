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
  showCalificaciones: boolean = false;  // Control para mostrar u ocultar la sección de calificaciones

  selectedFile: File | null = null;
  uploadSuccess: boolean | null = null;
  uploadError: boolean | null = null;
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

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
                // Asegúrate de que los maestros incluyen la propiedad `id`
                this.maestros = maestros.map(maestro => ({
                  ...maestro,
                  asistio: false  // Inicialmente, nadie ha asistido
                }));
                console.log('Maestros obtenidos:', this.maestros);  // Log para verificar propiedades
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

  // Método para guardar asistencias y verificar el porcentaje de cada maestro
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

          // Después de guardar las asistencias, verifica y actualiza el porcentaje de cada maestro
          this.maestros.forEach(maestro => {
            //this.verificarYActualizarAsistencias(maestro.id);
          });
        },
        error: (err) => {
          console.error('Error al guardar asistencias:', err);
          alert('Error al guardar asistencias. Inténtalo de nuevo más tarde.');
        }
      });
  }

  // Método para alternar la visibilidad de la sección de calificaciones
  toggleCalificaciones(): void {
    this.showCalificaciones = !this.showCalificaciones;
  }

  // Método para guardar la calificación de un maestro
  guardarCalificacion(maestroId: number): void {
    const cursoId = this.route.snapshot.paramMap.get('id');
    const maestro = this.maestros.find(m => m.id === maestroId); // Encuentra el maestro correspondiente

    if (maestro && maestro.calificacion != null) { // Verifica que la calificación no sea nula
      // Verificar si ya existe una calificación
      this.http.get<any>(`http://localhost:3000/curso/${cursoId}/calificaciones?usuario_id=${maestro.id}`)
        .subscribe({
          next: (response) => {
            if (response.existe) {
              alert('El maestro ya tiene una calificación para este curso.');
            } else {
              const calificacionData = {
                curso_id: cursoId,
                usuario_id: maestro.id,
                calificacion: maestro.calificacion
              };

              // Realiza la solicitud para guardar la calificación
              this.http.post(`http://localhost:3000/curso/${cursoId}/guardar-calificacion`, calificacionData)
                .subscribe({
                  next: () => {
                    alert('Calificación guardada exitosamente');
                  },
                  error: (err) => {
                    console.error('Error al guardar la calificación:', err);
                    alert('Error al guardar la calificación. Inténtalo de nuevo más tarde.');
                  }
                });
            }
          },
          error: (err) => {
            console.error('Error al verificar calificación existente:', err);
            alert('Error al verificar calificación. Inténtalo de nuevo más tarde.');
          }
        });
    } else {
      alert('Por favor, ingresa una calificación válida.');
    }
  }

  // Método para verificar y actualizar asistencias en usuario_requisitos
  verificarYActualizarAsistencias(maestroId: number): void {
    const cursoId = this.route.snapshot.paramMap.get('id');
    const data = {
      usuario_id: maestroId
    };

    this.http.post<any>(`http://localhost:3000/curso/${cursoId}/verificar-asistencias`, data)
      .subscribe({
        next: (response) => {
          const mensaje = response.cumplioAsistencias
            ? 'El maestro cumple con más del 80% de asistencia.'
            : 'El maestro no cumple con el 80% de asistencia.';
          alert(mensaje);
        },
        error: (err) => {
          console.error('Error al verificar asistencias:', err);
          alert('Error al verificar asistencias. Inténtalo de nuevo más tarde.');
        }
      });
  }
  // Manejar la selección del archivo
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  // Enviar el archivo al servidor
  onSubmit() {
    const cursoId = this.route.snapshot.paramMap.get('id');
    const usuarioId = localStorage.getItem('userId');
    const formData = new FormData();

    if (!usuarioId || !cursoId) {
      console.error('usuarioId o cursoId son null. Asegúrate de que existen en la ruta.');
      return;
    }

    if (this.selectedFile) {
      formData.append('archivo', this.selectedFile);
      formData.append('usuarioId', usuarioId);
      formData.append('cursoId', cursoId);

      this.http.post('http://localhost:3000/uploads', formData, { responseType: 'text' })
        .subscribe({
          next: (response) => {
            console.log('Respuesta del servidor:', response);
            this.uploadSuccess = true;
          },
          error: (error) => {
            console.error('Error al subir archivo', error);
            this.uploadError = true;
          }
        });
    }
  }
}
