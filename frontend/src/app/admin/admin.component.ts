import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  cursos: any[] = [];

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
        this.obtenerCursos(); // Actualiza la lista después de aceptar/rechazar
      }, error => {
        console.error('Error al actualizar el curso:', error);
      });
  }
}
