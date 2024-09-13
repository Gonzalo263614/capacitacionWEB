// maestro.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-maestro',
  templateUrl: './maestro.component.html',
  styleUrls: ['./maestro.component.css']
})
export class MaestroComponent implements OnInit {
  cursos: any[] = [];

  constructor(private http: HttpClient) {}

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
  }
  
}
