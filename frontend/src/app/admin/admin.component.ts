import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  cursos: any[] = [];
  mostrarCursos: boolean = false; // Variable para controlar si se muestran los cursos
  cursosAceptados: any[] = [];


  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.obtenerCursos();
    this.obtenerCursosAceptados();
  }

  obtenerCursos() {
    this.http.get('http://localhost:3000/cursos-propuestos')
      .subscribe((data: any) => {
        this.cursos = data.filter((curso: any) => curso.estado === 'pendiente');
        // Inicializa departamentos para cada curso
        this.cursos.forEach(curso => {
          curso.departamentos = []; // Asegúrate de que exista
          this.obtenerDepartamentos(curso.id, curso);
        });
      }, error => {
        console.error('Error al obtener los cursos:', error);
      });
  }


  obtenerDepartamentos(cursoId: number, curso: any) {
    this.http.get(`http://localhost:3000/departamentos-por-curso/${cursoId}`)
      .subscribe((data: any) => {
        // Asegúrate de que data sea un arreglo
        curso.departamentos = Array.isArray(data) ? data.map((d: any) => d.nombre) : [];
      }, error => {
        console.error('Error al obtener los departamentos:', error);
      });
  }


  actualizarEstado(id: number, estado: string) {
    if (estado === 'aceptado') {
      this.actualizarRequisitosCurso(id, 1).subscribe(() => {
        this.verificarRequisitos(id);
      });
    } else if (estado === 'rechazado') {
      // Actualiza el campo orden_admin y el estado del curso a 'rechazado'
      this.actualizarRequisitosCurso(id, 0).subscribe(() => {
        this.http.put(`http://localhost:3000/actualizar-curso/${id}`, { estado: 'rechazado' })
          .subscribe(() => {
            console.log(`Curso ${id} rechazado y actualizado a 'rechazado'`);
            this.obtenerCursos(); // Recarga los cursos para reflejar el cambio
          }, error => {
            console.error('Error al actualizar el estado del curso a "rechazado":', error);
          });
      });
    }
  }
  
  actualizarRequisitosCurso(cursoId: number, ordenAdmin: number) {
    return this.http.put(`http://localhost:3000/actualizar-requisitos-curso/${cursoId}`, { orden_admin: ordenAdmin });
  }

  verificarRequisitos(cursoId: number) {
    // Verifica si ambos campos 'orden_admin' y 'orden_subdirector' son 1
    this.http.get(`http://localhost:3000/verificar-requisitos-curso/${cursoId}`)
      .subscribe((data: any) => {
        if (data.orden_admin === 1 && data.orden_subdirector === 1) {
          // Si ambos son 1, entonces acepta el curso
          this.aceptarCurso(cursoId);
        } else {
          console.log('El curso aún no puede ser aceptado.');
        }
      }, error => {
        console.error('Error al verificar los requisitos del curso:', error);
      });
  }
  aceptarCurso(cursoId: number) {
    // Actualiza el estado del curso a 'aceptado'
    this.http.put(`http://localhost:3000/actualizar-curso/${cursoId}`, { estado: 'aceptado' })
      .subscribe(response => {
        console.log('Curso aceptado:', response);
        this.registrarInstructor(cursoId); // Registra al instructor después de aceptar el curso
        this.obtenerCursos(); // Recarga los cursos
      }, error => {
        console.error('Error al aceptar el curso:', error);
      });
  }
  registrarInstructor(cursoId: number) {
    this.http.get(`http://localhost:3000/cursos/${cursoId}`)
      .subscribe((curso: any) => {
        const instructorData = {
          nombre: curso.nombre_instructor,
          apellidopaterno: curso.apellidopaterno_instructor,
          apellidomaterno: curso.apellidomaterno_instructor,
          rol: 'instructor',
          curp: curso.curp_instructor,
          rfc: curso.rfc_instructor,
          maxestudios: curso.maxestudios_instructor,
          email: curso.email_instructor,
          password: curso.password_instructor,
          sexo: curso.sexo_instructor,
          departamento: 'No aplica',
          tipo_contrato: curso.tipo_contrato_instructor,
        };

        // Registrar el instructor
        this.http.post('http://localhost:3000/register', instructorData)
          .subscribe((response: any) => {
            console.log('Instructor registrado:', response);
            const instructorId = response.userId; // Obtener el ID del instructor

            // Agregar la entrada en la tabla instructor_curso
            const instructorCursoData = {
              id_usuario_instructor: instructorId,
              id_curso_propuesto: cursoId
            };

            this.http.post('http://localhost:3000/instructor-curso', instructorCursoData)
              .subscribe(() => {
                console.log('Instructor inscrito en el curso exitosamente.');
              }, error => {
                console.error('Error al inscribir al instructor en el curso:', error);
              });
          }, error => {
            console.error('Error al registrar el instructor:', error);
          });
      }, error => {
        console.error('Error al obtener datos del curso:', error);
      });
  }
  mostrarCampoComentario(curso: any) {
    curso.mostrarComentario = !curso.mostrarComentario; // Alterna la visibilidad del campo de comentario
  }

  solicitarRevision(id: number, comentario: string) {
    const data = { estado: 'pendiente_revision', comentario };
  
    // Primero, actualizamos la tabla requisitos_curso
    this.http.put(`http://localhost:3000/actualizar-requisitos-curso/${id}`, { orden_admin: 0 })
      .subscribe(() => {
        console.log(`Requisitos del curso ${id} actualizados a 0`);
  
        // Luego, actualizamos el estado del curso a 'pendiente_revision'
        this.http.put(`http://localhost:3000/actualizar-curso/${id}`, data)
          .subscribe(response => {
            console.log('Curso enviado para revisión:', response);
            this.obtenerCursos(); // Vuelve a cargar los cursos para actualizar la lista
          }, error => {
            console.error('Error al solicitar revisión del curso:', error);
          });
      }, error => {
        console.error('Error al actualizar requisitos del curso:', error);
      });
  }
  


  // Función para alternar la visibilidad de los cursos
  toggleCursos() {
    this.mostrarCursos = !this.mostrarCursos;
  }
  obtenerCursosAceptados() {
    this.http.get('http://localhost:3000/cursos')
      .subscribe((data: any) => {
        this.cursosAceptados = data;
      }, error => {
        console.error('Error al obtener los cursos aceptados:', error);
      });
  }

  irACurso(cursoId: number) {
    this.router.navigate(['/detallecursoadmin', cursoId]);
  }
}
