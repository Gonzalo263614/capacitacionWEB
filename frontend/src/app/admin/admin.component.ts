import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  cursos: any[] = [];
  mostrarCursos: boolean = false; // Variable para controlar si se muestran los cursos

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerCursos();
  }

  obtenerCursos() {
    this.http.get('http://localhost:3000/cursos-propuestos')
      .subscribe((data: any) => {
        this.cursos = data.filter((curso: any) => curso.estado === 'pendiente');
      }, error => {
        console.error('Error al obtener los cursos:', error);
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
        };

        this.http.post('http://localhost:3000/register', instructorData)
          .subscribe(response => {
            console.log('Instructor registrado:', response);
          }, error => {
            console.error('Error al registrar el instructor:', error);
          });
      }, error => {
        console.error('Error al obtener datos del curso:', error);
      });
  }

  // Función para alternar la visibilidad de los cursos
  toggleCursos() {
    this.mostrarCursos = !this.mostrarCursos;
  }
}
