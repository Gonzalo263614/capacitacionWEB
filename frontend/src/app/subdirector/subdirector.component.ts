import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subdirector',
  templateUrl: './subdirector.component.html',
  styleUrl: './subdirector.component.css'
})
export class SubdirectorComponent implements OnInit {
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
    this.http.put(`http://localhost:3000/actualizar-curso/${id}`, { estado })
      .subscribe(response => {
        console.log(`Curso ${estado}:`, response);
        if (estado === 'aceptado') {
          this.registrarInstructor(id);
        }
        this.obtenerCursos();
      }, error => {
        console.error('Error al actualizar el curso:', error);
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

    this.http.put(`http://localhost:3000/actualizar-curso/${id}`, data)
      .subscribe(response => {
        console.log('Curso enviado para revisión:', response);
        this.obtenerCursos(); // Vuelve a cargar los cursos para actualizar la lista
      }, error => {
        console.error('Error al solicitar revisión del curso:', error);
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
