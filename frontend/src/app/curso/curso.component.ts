import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { jsPDF } from 'jspdf';

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
  nombreCompleto: string = ''; // Propiedad para almacenar el nombre completo

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

  descargarConstancia(): void {
    // Obtener el nombre completo del maestro
    this.http.get<any>(`http://localhost:3000/usuarioConstancia/${this.usuarioId}`)
      .subscribe({
        next: (response) => {
          this.nombreCompleto = response.nombreCompleto;

          // Contar las asistencias
          this.http.get<any>(`http://localhost:3000/asistencias/count/${this.usuarioId}/${this.cursoId}`)
            .subscribe({
              next: (asistenciasResponse) => {
                const totalAsistencias = asistenciasResponse.totalAsistencias;
                const asistenciasCompletas = asistenciasResponse.asistenciasCompletas;
                const porcentajeAsistencia = (asistenciasCompletas / totalAsistencias) * 100;

                // Si cumple con el 80% de asistencias, actualiza el requisito de asistencias
                if (porcentajeAsistencia >= 80) {
                  this.http.put<any>(`http://localhost:3000/usuario_requisitos/${this.usuarioId}/${this.cursoId}`, { asistencias: 1 })
                    .subscribe({
                      next: () => {
                        console.log('Requisito de asistencias actualizado.');
                        this.verificarRequisitos(); // Llama a la verificación de requisitos
                      },
                      error: (err) => {
                        console.error('Error al actualizar el requisito de asistencias:', err);
                      }
                    });
                } else {
                  alert('El usuario no cumple con el 80% de asistencias.');
                }
              },
              error: (err) => {
                console.error('Error al contar las asistencias:', err);
              }
            });
        },
        error: (err) => {
          console.error('Error al obtener el nombre del maestro:', err);
        }
      });
  }

  verificarRequisitos(): void {
    // Verificar los requisitos del curso
    this.http.get<any>(`http://localhost:3000/requisitos/${this.usuarioId}/${this.cursoId}`)
      .subscribe({
        next: (requisitosResponse) => {
          const { asistencias, calificacion, evidencias, encuesta1, encuestajefes } = requisitosResponse;
          let requisitosFaltantes: string[] = [];

          if (asistencias !== 1) requisitosFaltantes.push('Asistencias');
          if (calificacion !== 1) requisitosFaltantes.push('Calificación');
          if (evidencias !== 1) requisitosFaltantes.push('Evidencias');
          if (encuesta1 !== 1) requisitosFaltantes.push('Encuesta 1');
          if (encuestajefes !== 1) requisitosFaltantes.push('Encuesta Jefes');

          if (requisitosFaltantes.length > 0) {
            alert(`No se cumplen los siguientes requisitos: ${requisitosFaltantes.join(', ')}`);
          } else {
            console.log('Todos los requisitos cumplidos. Generando constancia...');
            this.generarConstancia(); // Llama a la generación de la constancia
          }
        },
        error: (err) => {
          console.error('Error al verificar los requisitos:', err);
        }
      });
  }

  generarConstancia(): void {
    // Obtener el número de registro y generar el PDF
    this.http.get<any>(`http://localhost:3000/codigo/${this.cursoId}/${this.usuarioId}`)
      .subscribe({
        next: (codigoResponse) => {
          const numeroRegistro = codigoResponse.codigo;
          const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: 'a4',
          });

          const pageWidth = doc.internal.pageSize.getWidth();
          const pageHeight = doc.internal.pageSize.getHeight();

          const img = new Image();
          img.src = 'ilustracion_constancia.png'; // Ruta de la imagen

          img.onload = () => {
            doc.addImage(img, 'PNG', 0, 0, pageWidth, pageHeight);

            const fechaInicio = new Date(this.curso.fecha_inicio);
            const fechaFin = new Date(this.curso.fecha_fin);

            const obtenerMes = (mes: number) => {
              const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
              return meses[mes];
            };

            const diaInicio = fechaInicio.getDate().toString().padStart(2, '0');
            const diaFin = fechaFin.getDate().toString().padStart(2, '0');
            const mesInicio = obtenerMes(fechaInicio.getMonth());
            const mesFin = obtenerMes(fechaFin.getMonth());
            const añoInicio = fechaInicio.getFullYear();

            const duracionCurso = `del ${diaInicio} al ${diaFin} de ${mesInicio} ${añoInicio}`;

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(14);
            doc.text(`${this.nombreCompleto}`, 180, 300);
            doc.text(`Por haber participado en el curso de ${this.curso.tipo_curso}`, 80, 340);
            doc.text(`"${this.curso.nombre_curso}"`, 200, 360);
            doc.text(`Con el número de registro ${numeroRegistro} y ${this.curso.numero_horas}hrs. de duracion`, 80, 380);
            doc.text(`Realizado ${duracionCurso}`, 120, 400);
            doc.text(`Dentro de las instalaciones del instituto en modalidad ${this.curso.modalidad_curso}`, 75, 420);
            doc.text(`Aguascalientes, Ags., a ${new Date().toLocaleDateString()}`, 125, 440);

            doc.save('constancia.pdf');
          };
        },
        error: (err) => {
          console.error('Error al obtener el número de registro:', err);
        }
      });
  }

  obtenerNombreCompleto(): void {
    this.http.get<any>(`http://localhost:3000/usuarioConstancia/${this.usuarioId}`)
      .subscribe({
        next: (response) => {
          this.nombreCompleto = response.nombreCompleto;  // Usar 'nombreCompleto' directamente
        },
        error: (err) => {
          console.error('Error al obtener el nombre del maestro:', err);
        }
      });
  }

}
