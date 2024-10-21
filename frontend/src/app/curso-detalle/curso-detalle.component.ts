import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-curso-detalle',
  templateUrl: './curso-detalle.component.html',
  styleUrls: ['./curso-detalle.component.css']
})
export class CursoDetalleComponent implements OnInit {
  curso: any;  // Datos del curso
  maestros: any[] = [];  // Lista de maestros inscritos
  error: string = '';  // Para manejar errores
  showCurso: boolean = false;  // Control para mostrar u ocultar detalles del curso
  showMaestros: boolean = false;  // Control para mostrar u ocultar la lista de maestros

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const cursoId = this.route.snapshot.paramMap.get('id');  // Obtiene el ID del curso de la URL

    // Obtener los detalles del curso
    this.http.get<any>(`http://localhost:3000/curso/${cursoId}`)
      .subscribe({
        next: (response) => {
          this.curso = response;  // Almacena los detalles del curso

          // Obtener los maestros inscritos en este curso
          this.http.get<any[]>(`http://localhost:3000/curso/${cursoId}/maestros`)
            .subscribe({
              next: (maestros) => {
                this.maestros = maestros;  // Almacena la lista de maestros
              },
              error: (err) => {
                console.error('Error al obtener los maestros:', err);
                this.error = 'Error al obtener los maestros. Inténtalo de nuevo más tarde.';
              }
            });
        },
        error: (err) => {
          console.error('Error al obtener los detalles del curso:', err);
          this.error = 'Error al obtener los detalles del curso. Inténtalo de nuevo más tarde.';
        }
      });
  }

  // Método para alternar la visibilidad de los detalles del curso
  toggleCurso(): void {
    this.showCurso = !this.showCurso;
  }

  // Método para alternar la visibilidad de la lista de maestros
  toggleMaestros(): void {
    this.showMaestros = !this.showMaestros;
  }
}
