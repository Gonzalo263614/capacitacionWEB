import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { jsPDF } from 'jspdf';

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

  selectedFileTematico: File | null = null;
  uploadSuccessTematico: boolean | null = null;
  uploadErrorTematico: boolean | null = null;
  usuario: any = {}; // Información del usuario
  nombreCompleto: string = ''; // Propiedad para almacenar el nombre completo
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
    // Obtener los datos del usuario
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
      if (file.type === "application/pdf") {
        this.selectedFile = file;
      } else {
        alert("Por favor, selecciona un archivo en formato PDF.");
        event.target.value = ""; // Limpiar la selección
      }
    }
  }

  // Enviar el archivo al servidor
  onSubmit(): void {
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

      // Realizar la solicitud de carga
      this.http.post('http://localhost:3000/uploads', formData, { responseType: 'text' })
        .subscribe({
          next: (response) => {
            console.log('Respuesta del servidor:', response);
            this.uploadSuccess = true;  // Marca como éxito
            this.uploadError = false;  // Desactiva el error
            // Llamar a la función para actualizar la tabla instructor_requisitos
            this.actualizarTablaInstructorrequisitos(3); // Mandar 3 para actualizar evidencias
          },
          error: (error) => {
            console.error('Error al subir archivo', error);
            this.uploadError = true;  // Marca como error
            this.uploadSuccess = false;  // Desactiva el éxito
          }
        });
    }
  }

  // Manejar la selección del archivo para contenidos temáticos
  onFileSelectedTematico(event: any): void {
    const fileTematico = event.target.files[0];
    if (fileTematico) {
      if (fileTematico.type === "application/pdf") {
        this.selectedFileTematico = fileTematico; // Variable específica para contenidos temáticos
      } else {
        alert("Por favor, selecciona un archivo en formato PDF.");
        event.target.value = ""; // Limpiar la selección
      }
    }
  }

  // Enviar el archivo al servidor para contenidos temáticos
  onSubmitTematico(): void {
    const cursoIdTematico = this.route.snapshot.paramMap.get('id'); // ID del curso
    const instructorIdTematico = localStorage.getItem('userId'); // ID del instructor
    const formDataTematico = new FormData();

    if (!cursoIdTematico || !instructorIdTematico) {
      console.error('cursoIdTematico o instructorIdTematico son null. Verifica que existan.');
      return;
    }

    if (this.selectedFileTematico) {
      formDataTematico.append('archivoTematico', this.selectedFileTematico); // Nuevo nombre para evitar conflictos
      formDataTematico.append('cursoId', cursoIdTematico);
      formDataTematico.append('instructorId', instructorIdTematico);

      // Realizar la solicitud de carga
      this.http.post('http://localhost:3000/contenidos-tematicos/uploads', formDataTematico, { responseType: 'text' })
        .subscribe({
          next: (response) => {
            console.log('Respuesta del servidor:', response);
            this.uploadSuccessTematico = true;  // Marca como éxito
            this.uploadErrorTematico = false;  // Desactiva el error
            // Llamar a la función para actualizar la tabla
            this.actualizarTablaInstructorrequisitos(2); // Mandar 2 para actualizar `contenidos`
          },
          error: (error) => {
            console.error('Error al subir archivo temático', error);
            this.uploadErrorTematico = true;  // Marca como error
            this.uploadSuccessTematico = false;  // Desactiva el éxito
          }
        });
    }
  }

  guardarTodasLasCalificaciones(): void {
    const cursoId = this.route.snapshot.paramMap.get('id');

    // Primero, verificamos si ya existen calificaciones
    this.http.get<any>(`http://localhost:3000/curso/${cursoId}/calificaciones`)
      .subscribe({
        next: (response) => {
          // Si no hay calificaciones, las guardamos
          if (response.message === 'No hay calificaciones registradas.') {
            const calificaciones = this.maestros.map(maestro => ({
              curso_id: cursoId,
              usuario_id: maestro.id,
              calificacion: maestro.calificacion
            }));

            // Hacer la solicitud para guardar las calificaciones
            this.http.post(`http://localhost:3000/curso/${cursoId}/guardar-calificaciones`, calificaciones)
              .subscribe({
                next: () => {
                  alert('Calificaciones guardadas exitosamente');
                  this.actualizarTablaInstructorrequisitos(1);
                },
                error: (err) => {
                  // Aquí capturamos el error y mostramos el mensaje
                  if (err.error && err.error.message) {
                    alert(err.error.message);  // Muestra el mensaje de error desde el backend
                  } else {
                    console.error('Error al guardar las calificaciones:', err);
                    alert('Error al guardar las calificaciones. Inténtalo de nuevo más tarde.');
                  }
                }
              });
          } else {
            // Si ya existen calificaciones, mostramos un mensaje
            alert(response.message);  // Muestra el mensaje de error que viene del backend
          }
        },
        error: (err) => {
          console.error('Erro Calificaciones:', err);
          alert('Ya se ha asignado las calificaciones.');
        }
      });
  }
  actualizarTablaInstructorrequisitos(accion: number): void {
    const cursoId = this.route.snapshot.paramMap.get('id');
    const instructorId = localStorage.getItem('userId'); // ID del instructor
    if (!cursoId || !instructorId) {
      console.error('Curso ID o Instructor ID son null. Verifica que existan.');
      return;
    }
    // Dependiendo de la acción, hacemos algo diferente
    if (accion === 1) {
      // Actualizar calificaciones en instructor_requisitos
      this.http.put(`http://localhost:3000/instructor-requisitos/${cursoId}/${instructorId}/actualizar-calificaciones`, { calificaciones: 1 })
        .subscribe({
          next: () => {
            console.log('Calificaciones actualizadas a 1 en instructor_requisitos.');
          },
          error: (err) => {
            console.error('Error al actualizar calificaciones en instructor_requisitos:', err);
          }
        });
    } else if (accion === 2) {
      // Actualizar contenidos en instructor_requisitos
      this.http.put(`http://localhost:3000/instructor-requisitos/${cursoId}/${instructorId}/actualizar-contenidos`, { contenidos: 1 })
        .subscribe({
          next: () => {
            console.log('Contenidos actualizados a 1 en instructor_requisitos.');
          },
          error: (err) => {
            console.error('Error al actualizar contenidos en instructor_requisitos:', err);
          }
        });
    } else if (accion === 3) {
      // Actualizar evidencias en instructor_requisitos
      this.http.put(`http://localhost:3000/instructor-requisitos/${cursoId}/${instructorId}/actualizar-evidencias`, { evidencias: 1 })
        .subscribe({
          next: () => {
            console.log('Evidencias actualizadas a 1 en instructor_requisitos.');
          },
          error: (err) => {
            console.error('Error al actualizar evidencias en instructor_requisitos:', err);
          }
        });
    }
  }
  generateConstancia(): void {
    const cursoId = this.route.snapshot.paramMap.get('id'); // ID del curso
    const instructorId = localStorage.getItem('userId'); // ID del instructor
    console.log('Curso ID:', cursoId);
    console.log('Instructor ID:', instructorId);

    if (!cursoId || !instructorId) {
      alert('Error al obtener los datos necesarios para generar la constancia.');
      return;
    }

    // Verificar requisitos en la tabla instructor_requisitos
    this.http.get<any>(`http://localhost:3000/validar-requisitos/${cursoId}/${instructorId}`)
      .subscribe({
        next: (response) => {
          const { calificaciones, contenidos, evidencias } = response;

          // Validar si todos los campos son 1
          if (calificaciones === 1 && contenidos === 1 && evidencias === 1) {
            // Continuar con la generación de la constancia
            this.generarPDF(cursoId, instructorId);
          } else {
            // Mostrar mensaje con los campos faltantes
            const faltantes = [];
            if (calificaciones !== 1) faltantes.push('calificaciones');
            if (contenidos !== 1) faltantes.push('contenidos');
            if (evidencias !== 1) faltantes.push('evidencias');
            alert(`No se puede generar la constancia. Los siguientes campos están incompletos: ${faltantes.join(', ')}`);
          }
        },
        error: (err) => {
          console.error('Error al validar requisitos:', err);
          alert('Error al validar los requisitos. Inténtalo de nuevo más tarde.');
        }
      });
  }

  // Generar el PDF (mismo código que ya tienes para la generación de la constancia)
  private generarPDF(cursoId: string, instructorId: string): void {
    console.log('Curso ID:', cursoId);
    console.log('Instructor ID:', instructorId);

    if (!cursoId || !instructorId) {
      alert('Error al obtener los datos necesarios para generar la constancia.');
      return;
    }

    // Primero, obtenemos el nombre completo del usuario
    this.http.get<any>(`http://localhost:3000/usuarioConstancia/${instructorId}`)
      .subscribe({
        next: (usuarioResponse) => {
          this.nombreCompleto = usuarioResponse.nombreCompleto;
          console.log(this.nombreCompleto);
          // Después, obtenemos el número de registro
          this.http.get<any>(`http://localhost:3000/codigocurso/${cursoId}/${instructorId}`)
            .subscribe({
              next: (codigoResponse) => {
                const numeroRegistro = codigoResponse.codigo;
                console.log(numeroRegistro);
                // Crear el PDF con los datos obtenidos
                const doc = new jsPDF({
                  orientation: 'portrait',
                  unit: 'px',
                  format: 'a4',
                });

                const pageWidth = doc.internal.pageSize.getWidth();
                const pageHeight = doc.internal.pageSize.getHeight();

                // Verificar que las dimensiones de la página sean correctas
                console.log('pageWidth:', pageWidth, 'pageHeight:', pageHeight);

                const img = new Image();
                img.src = 'ilustracion_constancia.png'; // Ruta de la imagen

                img.onload = () => {
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
                  doc.addImage(img, 'PNG', 0, 0, pageWidth, pageHeight);

                  // Agregar texto personalizado
                  doc.setFontSize(16);
                  doc.setFont('Helvetica', 'bold');
                  doc.text('CONSTANCIA', pageWidth / 2, 100, { align: 'center' });

                  doc.setFont('helvetica', 'normal');
                  doc.setFontSize(14);
                  doc.text(`${this.nombreCompleto}`, 180, 300);
                  doc.text(`Por haber impartido en el curso de ${this.curso.tipo_curso}`, 80, 320);
                  doc.text(`"${this.curso.nombre_curso}"`, 200, 340);
                  doc.text(`Con el número de registro ${numeroRegistro} y ${this.curso.numero_horas}hrs. de duracion`, 80, 360);
                  doc.text(`Realizado ${duracionCurso}`, 120, 380);
                  doc.text(`Dentro de las instalaciones del instituto en modalidad ${this.curso.modalidad_curso}`, 75, 400);
                  doc.text(`Aguascalientes, Ags., a ${new Date().toLocaleDateString()}`, 125, 420);

                  // Guardar el PDF
                  doc.save(`Constancia_${this.nombreCompleto}.pdf`);
                };
              },
              error: (err) => {
                console.error('Error al obtener el número de registro:', err);
                alert('Error al generar la constancia. Inténtalo de nuevo más tarde.');
              }
            });
        },
        error: (err) => {
          console.error('Error al obtener los datos del usuario:', err);
          alert('Error al obtener el nombre del usuario. Inténtalo de nuevo más tarde.');
        }
      });
  }

}
