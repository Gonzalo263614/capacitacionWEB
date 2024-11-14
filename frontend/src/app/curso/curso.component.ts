import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-curso',
  templateUrl: './curso.component.html',
  styleUrls: ['./curso.component.css']
})
export class CursoComponent implements OnInit {
  curso: any = {};
  asistencias: any[] = [];
  calificacion: number | null = null;  // Nueva propiedad para almacenar la calificación
  error: string = '';
  showDetalles: boolean = false;
  showAsistencias: boolean = false;
  usuarioId: number = 0;  // ID del usuario, en este caso, lo puedes obtener dinámicamente
  cursoId: string | null = '';
  showEncuesta: boolean = false; // Controla la visibilidad de la encuesta

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId) {
        this.usuarioId = parseInt(storedUserId, 10);  // Convertir a número
      } else {
        console.error('No se encontró el ID del usuario en localStorage.');
      }
    } else {
      // console.error('localStorage no está disponible.');
    }

    // Continuar con la lógica para obtener el curso
    this.cursoId = this.route.snapshot.paramMap.get('id');

    if (this.cursoId) {
      this.http.get<any>(`http://localhost:3000/curso/${this.cursoId}`)
        .subscribe({
          next: (response) => {
            this.curso = response;
          },
          error: (err) => {
            console.error('Error al obtener los detalles del curso:', err);
            this.error = 'Error al obtener los detalles del curso. Inténtalo de nuevo más tarde.';
          }
        });
    } else {
      console.error('No se encontró el cursoId en la URL.');
    }
    this.obtenerCalificacion();  // Llamar al método para obtener la calificación al inicializar
  }
  // Método para obtener la calificación del usuario
  obtenerCalificacion(): void {
    this.http.get<any>(`http://localhost:3000/curso/${this.cursoId}/calificacion/${this.usuarioId}`)
      .subscribe({
        next: (response) => {
          this.calificacion = response.calificacion;  // Almacena la calificación en la propiedad
        },
        error: (err) => {
          console.error('Error al obtener la calificación:', err);
          this.error = 'Error al obtener la calificación. Inténtalo de nuevo más tarde.';
        }
      });
  }
  // Método para alternar la visibilidad de los detalles del curso
  toggleDetalles(): void {
    this.showDetalles = !this.showDetalles;
  }

  // Método para obtener asistencias del usuario
  obtenerAsistencias(): void {
    this.http.get<any[]>(`http://localhost:3000/asistencias/${this.cursoId}/${this.usuarioId}`)
      .subscribe({
        next: (response) => {
          console.log('Asistencias:', response); // Agrega esto para ver la respuesta
          this.asistencias = response;
        },
        error: (err) => {
          console.error('Error al obtener las asistencias:', err);
          this.error = 'Error al obtener las asistencias. Inténtalo de nuevo más tarde.';
        }
      });
  }


  // Método para alternar la visibilidad de las asistencias
  toggleAsistencias(): void {
    this.showAsistencias = !this.showAsistencias;
    if (this.showAsistencias) {
      this.obtenerAsistencias();
    }
  }

  // Método para descargar la constancia
  descargarConstancia(): void {
    // Primero, realizar la consulta para contar las asistencias
    this.http.get<any>(`http://localhost:3000/asistencias/count/${this.usuarioId}/${this.cursoId}`)
      .subscribe({
        next: (asistenciasResponse) => {
          const totalAsistencias = asistenciasResponse.totalAsistencias;
          const asistenciasCompletas = asistenciasResponse.asistenciasCompletas;
  
          // Calcular el porcentaje de asistencia
          const porcentajeAsistencia = (asistenciasCompletas / totalAsistencias) * 100;
  
          // Primero, verificamos los requisitos sin importar las asistencias
          this.http.get<any>(`http://localhost:3000/requisitos/${this.usuarioId}/${this.cursoId}`)
            .subscribe({
              next: (response) => {
                const { asistencias, calificacion, evidencias, encuesta1, encuestajefes } = response;
                let requisitosFaltantes: string[] = [];
  
                // Verificar los requisitos faltantes
                if (asistencias !== 1) requisitosFaltantes.push('Asistencias');
                if (calificacion !== 1) requisitosFaltantes.push('Calificación');
                if (evidencias !== 1) requisitosFaltantes.push('Evidencias');
                if (encuesta1 !== 1) requisitosFaltantes.push('Encuesta 1');
                if (encuestajefes !== 1) requisitosFaltantes.push('Encuesta Jefes');
  
                // Si faltan requisitos, mostrar alerta
                if (requisitosFaltantes.length > 0) {
                  alert(`No se cumplen los siguientes requisitos: ${requisitosFaltantes.join(', ')}`);
                } else {
                  // Si se cumplen todos los requisitos, permitir la descarga
                  if (porcentajeAsistencia >= 80) {
                    // Actualizar la tabla usuario_requisitos a 1 (asistencias)
                    this.http.put<any>(`http://localhost:3000/usuario_requisitos/${this.usuarioId}/${this.cursoId}`, { asistencias: 1 })
                      .subscribe({
                        next: () => {
                          console.log('Se cumple con los requisitos y el 80% de asistencias.');
                          // Aquí puedes agregar el código para descargar la constancia
                        },
                        error: (err) => {
                          console.error('Error al actualizar usuario_requisitos:', err);
                        }
                      });
                  } else {
                    // Si el porcentaje de asistencias es insuficiente, mostrar mensaje
                    alert('El usuario no cumple con el 80% de asistencias. Se ha registrado un 0.');
                    this.http.put<any>(`http://localhost:3000/usuario_requisitos/${this.usuarioId}/${this.cursoId}`, { asistencias: 0 })
                      .subscribe({
                        next: () => {
                          console.log('Asistencias insuficientes, se ha registrado un 0.');
                        },
                        error: (err) => {
                          console.error('Error al actualizar usuario_requisitos:', err);
                        }
                      });
                  }
                }
              },
              error: (err) => {
                console.error('Error al verificar los requisitos:', err);
              }
            });
        },
        error: (err) => {
          console.error('Error al contar las asistencias:', err);
        }
      });
  }
  
}
