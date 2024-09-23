import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-maestro',
  templateUrl: './maestro.component.html',
  styleUrls: ['./maestro.component.css']
})
export class MaestroComponent implements OnInit {
  cursos: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.obtenerCursos();
  }

  obtenerCursos() {
    this.http.get('http://localhost:3000/cursos')
      .subscribe((data: any) => {
        this.cursos = data.map((curso: any) => ({
          ...curso,
          mostrarDetalles: false // Inicialmente ocultar detalles
        }));
      }, error => {
        console.error('Error al obtener los cursos:', error);
      });
  }

  toggleDetails(cursoId: number) {
    const curso = this.cursos.find(c => c.id === cursoId);
    if (curso) {
      curso.mostrarDetalles = !curso.mostrarDetalles;
    }
  }

  inscribir(cursoId: number) {
    const token = localStorage.getItem('token'); // Obtener el token del localStorage
    this.http.post(`http://localhost:3000/inscribir/${cursoId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}` // Enviar el token en el header
      }
    }).subscribe(
      (response: any) => {
        console.log('Inscripción exitosa:', response);
        alert('Te has inscrito con éxito en el curso');
      },
      error => {
        console.error('Error al inscribirse en el curso:', error);
        alert('Hubo un error al intentar inscribirte. Por favor, intenta nuevamente.');
      }
    );
  }
}
