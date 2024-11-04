import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalle-curso-admin',
  templateUrl: './detalle-curso-admin.component.html',
  styleUrls: ['./detalle-curso-admin.component.css'] // Corrige aquí a 'styleUrls'
})
export class DetalleCursoAdminComponent {
  curso: any;
  archivos: any[] = []; // Arreglo para almacenar los archivos

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {
    const cursoId = this.route.snapshot.paramMap.get('id');
    this.obtenerDetalleCurso(cursoId);
    this.obtenerArchivos(cursoId); // Llamar a la función para obtener archivos
  }

  obtenerDetalleCurso(id: string | null) {
    this.http.get(`http://localhost:3000/cursos/${id}`)
      .subscribe((data: any) => {
        this.curso = data;
      }, error => {
        console.error('Error al obtener el detalle del curso:', error);
      });
  }

  obtenerArchivos(cursoId: string | null) {
    this.http.get(`http://localhost:3000/archivos/curso/${cursoId}`)
      .subscribe((data: any) => {
        this.archivos = data; // Almacenar los archivos en la variable
      }, error => {
        console.error('Error al obtener los archivos:', error);
      });
  }

  descargarCurso() {
    const cursoId = this.curso?.id; // Obtén el ID del curso actual
    if (!cursoId) {
      console.error('No se encontró el ID del curso.');
      return;
    }

    this.http.get(`http://localhost:3000/descargar-curso/${cursoId}`, { responseType: 'blob' }).subscribe((response: Blob) => {
      const url = window.URL.createObjectURL(response);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Diagnóstico de necesidades de formación y actualización profesional docente_${this.curso.nombre_curso}.csv`; // Nombre del archivo
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }, error => {
      console.error('Error al descargar el archivo:', error);
    });
  }
  descargarCurso2() {
    const cursoId = this.curso?.id; // Obtén el ID del curso actual
    if (!cursoId) {
      console.error('No se encontró el ID del curso.');
      return;
    }

    this.http.get(`http://localhost:3000/descargar2-curso/${cursoId}`, { responseType: 'blob' }).subscribe((response: Blob) => {
      const url = window.URL.createObjectURL(response);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Diagnóstico de necesidades de formación y actualización profesional docente_${this.curso.nombre_curso}.csv`; // Nombre del archivo
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }, error => {
      console.error('Error al descargar el archivo:', error);
    });
  }
  descargarEncuestas() {
    const cursoId = this.curso?.id;
    if (!cursoId) {
      console.error('No se encontró el ID del curso.');
      return;
    }

    this.http.get(`http://localhost:3000/descargar-encuestas/${cursoId}`, { responseType: 'blob' })
      .subscribe((response: Blob) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Encuesta de la eficacia y de opinión de la capacitación del participante_${cursoId}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }, error => {
        console.error('Error al descargar el archivo de encuestas:', error);
      });
  }
  descargarEncuestasJefe() {
    const cursoId = this.curso?.id;
    if (!cursoId) {
      console.error('No se encontró el ID del curso.');
      return;
    }

    this.http.get(`http://localhost:3000/descargar-encuestas-jefe/${cursoId}`, { responseType: 'blob' })
      .subscribe((response: Blob) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Encuesta de la eficacia de la capacitación docente (jefaturas académicas)_${cursoId}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }, error => {
        console.error('Error al descargar el archivo de encuestas de jefe:', error);
      });
  }

}
