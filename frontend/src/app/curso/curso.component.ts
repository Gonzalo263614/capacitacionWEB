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
}
