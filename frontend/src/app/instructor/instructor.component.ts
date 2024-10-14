import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-instructor',
  templateUrl: './instructor.component.html',
  styleUrls: ['./instructor.component.css']
})
export class InstructorComponent implements OnInit {
  curso: any;  // Aquí guardaremos los datos del curso
  error: string = '';  // Para manejar errores si hay alguno

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Obtener el id del instructor desde el localStorage
    const idInstructor = localStorage.getItem('userId');

    if (idInstructor) {
      // Hacer una solicitud HTTP al backend para obtener el curso del instructor
      this.http.get<any>(`http://localhost:3000/instructor/curso/${idInstructor}`)
        .subscribe({
          next: (response) => {
            this.curso = response;  // Guardar los datos del curso
          },
          error: (err) => {
            console.error('Error al obtener el curso:', err);
            this.error = 'Error al obtener el curso. Inténtalo de nuevo más tarde.';
          }
        });
    } else {
      this.error = 'No se encontró el id del instructor en localStorage.';
    }
  }
}
