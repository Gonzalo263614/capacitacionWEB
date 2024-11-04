import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalle-curso-admin',
  templateUrl: './detalle-curso-admin.component.html',
  styleUrl: './detalle-curso-admin.component.css'
})
export class DetalleCursoAdminComponent {
  curso: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const cursoId = this.route.snapshot.paramMap.get('id');
    this.obtenerDetalleCurso(cursoId);
  }

  obtenerDetalleCurso(id: string | null) {
    this.http.get(`http://localhost:3000/cursos/${id}`)
      .subscribe((data: any) => {
        this.curso = data;
      }, error => {
        console.error('Error al obtener el detalle del curso:', error);
      });
  }
}