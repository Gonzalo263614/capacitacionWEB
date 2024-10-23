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
    this.router.navigate([`/cursos/${cursoId}`]); // Redirigir al componente del curso
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

  inscribir(cursoId: number) {
    if (typeof window !== 'undefined') { // Verificar si estamos en el navegador
      const token = localStorage.getItem('token'); // Obtener el token del localStorage
      if (token) {
        // Primero, obtener el departamento del maestro
        this.http.get('http://localhost:3000/mi-perfil', {
          headers: { Authorization: `Bearer ${token}` }
        }).subscribe((usuario: any) => {
          const departamentoMaestro = usuario.departamento;

          // Verificar si el curso tiene departamentos
          const curso = this.cursos.find(c => c.id === cursoId);
          if (curso.departamentos && !curso.departamentos.includes(departamentoMaestro)) {
            alert('No puedes inscribirte en este curso porque tu departamento no corresponde.');
            return;
          }

          // Proceder con la inscripción si el departamento es válido
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
