import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-maestro',
  templateUrl: './maestro.component.html',
  styleUrls: ['./maestro.component.css']
})
export class MaestroComponent implements OnInit {
  cursos: any[] = [];

  constructor(
    private http: HttpClient,
    private router: Router  // Inyección de Router para redireccionar
  ) { }

  ngOnInit(): void {
    this.obtenerCursos();
  }
  irACurso(cursoId: number) {
    this.router.navigate([`/curso/${cursoId}/asistencias`]); // Redirigir al componente del curso
  }
  obtenerCursos() {
    this.http.get('http://localhost:3000/cursos')
      .subscribe((data: any) => {
        this.cursos = data.map((curso: any) => ({
          ...curso,
          mostrarDetalles: false, // Inicialmente ocultar detalles
          inscrito: false // Inicializar la propiedad de inscripción
        }));

        // Verificar si el usuario ya está inscrito en cada curso
        if (typeof window !== 'undefined') { // Verificar si estamos en el navegador
          const token = localStorage.getItem('token');
          if (token) {
            this.cursos.forEach(curso => {
              this.http.get(`http://localhost:3000/inscripciones/${curso.id}`, {
                headers: { Authorization: `Bearer ${token}` }
              }).subscribe((res: any) => {
                curso.inscrito = res.inscrito; // Actualizar la propiedad inscrito
              });
              this.obtenerDepartamentos(curso.id, curso);
            });
          }
        }
      }, error => {
        console.error('Error al obtener los cursos:', error);
      });
  }
  obtenerDepartamentos(cursoId: number, curso: any) {
    this.http.get(`http://localhost:3000/departamentos-por-curso/${cursoId}`)
      .subscribe((data: any) => {
        curso.departamentos = data.map((d: any) => d.nombre); // Guarda los nombres de los departamentos en el objeto curso
      }, error => {
        console.error('Error al obtener los departamentos:', error);
      });
  }
  toggleDetails(cursoId: number) {
    const curso = this.cursos.find(c => c.id === cursoId);
    if (curso) {
      curso.mostrarDetalles = !curso.mostrarDetalles;
    }
  }

  darseDeBaja(cursoId: number) {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        // Buscar el curso correspondiente
        const curso = this.cursos.find(c => c.id === cursoId);
        if (!curso) {
          alert('Curso no encontrado.');
          return;
        }

        // Validar la fecha actual contra la fecha de inicio del curso
        const fechaInicio = new Date(curso.fecha_inicio); // Convertir la fecha de inicio del curso a un objeto Date
        const fechaActual = new Date(); // Obtener la fecha actual
        const unDiaDespues = new Date(fechaInicio);
        unDiaDespues.setDate(fechaInicio.getDate() + 1); // Incrementar un día después del inicio

        if (fechaActual >= unDiaDespues) {
          alert('Ya no puedes darte de baja de este curso porque la fecha límite ha pasado.');
          return;
        }

        // Realizar la solicitud HTTP para darse de baja
        this.http.delete(`http://localhost:3000/baja/${cursoId}`, {
          headers: { Authorization: `Bearer ${token}` }
        }).subscribe(
          (response: any) => {
            console.log('Baja exitosa:', response);
            alert('Te has dado de baja del curso con éxito');
            this.obtenerCursos(); // Actualizar la lista de cursos
          },
          error => {
            console.error('Error al darse de baja del curso:', error);
            alert('Hubo un error al intentar darte de baja. Por favor, intenta nuevamente.');
          }
        );
      }
    }
  }

  inscribir(cursoId: number) {
    if (typeof window !== 'undefined') { // Verificar si estamos en el navegador
      const token = localStorage.getItem('token'); // Obtener el token del localStorage
      if (token) {
        // Primero, obtener la información del curso
        const curso = this.cursos.find(c => c.id === cursoId);
        if (!curso) {
          alert('Curso no encontrado.');
          return;
        }

        // Validar la fecha actual contra la fecha de inicio del curso
        const fechaInicio = new Date(curso.fecha_inicio); // Convertir la fecha de inicio del curso a objeto Date
        const fechaActual = new Date(); // Obtener la fecha actual
        const unDiaDespues = new Date(fechaInicio);
        unDiaDespues.setDate(fechaInicio.getDate() + 1); // Incrementar un día después del inicio

        if (fechaActual > unDiaDespues) {
          alert('Ya no puedes inscribirte en este curso porque la fecha límite ha pasado.');
          return;
        }

        // Si la fecha es válida, continuar con la inscripción
        this.http.get('http://localhost:3000/mi-perfil', {
          headers: { Authorization: `Bearer ${token}` }
        }).subscribe((usuario: any) => {
          const departamentoMaestro = usuario.departamento;

          if (curso.departamentos) {
            const desarrolloAcademico = curso.departamentos.includes('Desarrollo Académico');
            const departamentoCoincide = curso.departamentos.includes(departamentoMaestro);

            if (!desarrolloAcademico && !departamentoCoincide) {
              alert('No puedes inscribirte en este curso porque tu departamento no corresponde.');
              return;
            }
          }

          this.http.post(`http://localhost:3000/inscribir/${cursoId}`, {}, {
            headers: {
              Authorization: `Bearer ${token}` // Enviar el token en el header
            }
          }).subscribe(
            (response: any) => {
              console.log('Inscripción exitosa:', response);
              alert('Te has inscrito con éxito en el curso');
              this.obtenerCursos(); // Actualizar la lista de cursos después de la inscripción
            },
            error => {
              console.error('Error al inscribirse en el curso:', error);
              if (error.error?.error === 'Cupo lleno, no se puede inscribir') {
                alert('El curso ha alcanzado su cupo máximo, no puedes inscribirte.');
              } else {
                alert('Hubo un error al intentar inscribirte. Por favor, intenta nuevamente.');
              }
            }
          );
        }, error => {
          console.error('Error al obtener el perfil del usuario:', error);
          alert('Hubo un error al obtener tu perfil. Por favor, intenta nuevamente.');
        });
      }
    }
  }



}
