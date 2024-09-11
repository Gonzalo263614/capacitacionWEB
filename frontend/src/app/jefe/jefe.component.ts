import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-jefe',
  templateUrl: './jefe.component.html',
  styleUrl: './jefe.component.css'
})
export class JefeComponent {
  nombreCurso = '';
  cupo = 0;

  constructor(private http: HttpClient) {}

  proponerCurso() {
    const curso = {
      nombre_curso: this.nombreCurso,
      cupo: this.cupo
    };

    this.http.post('http://localhost:3000/proponer-curso', curso)
      .subscribe(response => {
        console.log('Curso propuesto:', response);
      }, error => {
        console.error('Error al proponer el curso:', error);
      });
  }
}
