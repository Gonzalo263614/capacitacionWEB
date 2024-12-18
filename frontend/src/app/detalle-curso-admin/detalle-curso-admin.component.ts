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
  contenidos: any[] = []; // Archivos contenidos temáticos

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {
    const cursoId = this.route.snapshot.paramMap.get('id');
    this.obtenerDetalleCurso(cursoId);
    this.obtenerArchivos(cursoId); // Llamar a la función para obtener archivos
    this.obtenerContenidos(cursoId); // Archivos contenidos temáticos
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
  obtenerContenidos(cursoId: string | null) {
    this.http.get(`http://localhost:3000/archivosContenidos/curso/${cursoId}`)
      .subscribe((data: any) => {
        this.contenidos = data;
      }, error => {
        console.error('Error al obtener los contenidos:', error);
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
      a.download = `Ficha tecnica para registro del curso_${this.curso.nombre_curso}.csv`; // Nombre del archivo
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }, error => {
      console.error('Error al descargar el archivo:', error);
    });
  }
  descargarCurso3() {
    const cursoId = this.curso?.id; // Obtén el ID del curso actual
    if (!cursoId) {
      console.error('No se encontró el ID del curso.');
      return;
    }

    this.http.get(`http://localhost:3000/descargar3-curso/${cursoId}`, { responseType: 'blob' }).subscribe((response: Blob) => {
      const url = window.URL.createObjectURL(response);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Programa institucional de formacion docente y actualizacion profesional_${this.curso.nombre_curso}.csv`; // Nombre del archivo
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }, error => {
      console.error('Error al descargar el archivo:', error);
    });
  }
  descargarCriterios() {
    const cursoId = this.curso?.id; // Obtén el ID del curso actual
    if (!cursoId) {
      console.error('No se encontró el ID del curso.');
      return;
    }

    this.http.get(`http://localhost:3000/descargarCriterios-curso/${cursoId}`, { responseType: 'blob' }).subscribe((response: Blob) => {
      const url = window.URL.createObjectURL(response);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Criterios Para la seleccion del Instructor_${this.curso.nombre_curso}.pdf`; // Nombre del archivo
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
  descargarCalificaciones() {
    const cursoId = this.curso?.id;
    if (!cursoId) {
      console.error('No se encontró el ID del curso.');
      return;
    }

    this.http.get(`http://localhost:3000/descargar-calificaciones/${cursoId}`, { responseType: 'blob' })
      .subscribe((response: Blob) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Calificaciones_${this.curso.nombre_curso}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }, error => {
        console.error('Error al descargar el archivo de calificaciones:', error);
      });
  }
  descargarAsistencias() {
    const cursoId = this.curso?.id;
    if (!cursoId) {
      console.error('No se encontró el ID del curso.');
      return;
    }

    this.http.get(`http://localhost:3000/descargar-asistencias/${cursoId}`, { responseType: 'blob' })
      .subscribe((response: Blob) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Asistencias_${this.curso.nombre_curso}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }, error => {
        console.error('Error al descargar el archivo de asistencias:', error);
      });
  }
  descargarInscripcion() {
    const cursoId = this.curso?.id;
    if (!cursoId) {
      console.error('No se encontró el ID del curso.');
      return;
    }

    this.http.get(`http://localhost:3000/descargar-inscripcion/${cursoId}`, { responseType: 'blob' })
      .subscribe((response: Blob) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Inscripciones_${this.curso.nombre_curso}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }, error => {
        console.error('Error al descargar el archivo de inscripciones:', error);
      });
  }
  confirmarTerminarCurso() {
    const confirmacion = window.confirm("¿Estás seguro de que deseas marcar este curso como 'terminado'?");
    if (confirmacion) {
      this.terminarCurso();
    }
  }

  terminarCurso() {
    if (!this.curso || !this.curso.id) {
      console.error("No se encontró el ID del curso.");
      return;
    }

    const cursoId = this.curso.id;
    this.http.put(`http://localhost:3000/cursos/${cursoId}/terminar`, {})
      .subscribe(
        () => {
          alert("El curso se ha marcado como 'terminado'.");
          this.curso.estado = 'terminado'; // Actualiza el estado localmente
        },
        (error) => {
          console.error("Error al terminar el curso:", error);
          alert("Hubo un error al marcar el curso como 'terminado'. Intenta de nuevo.");
        }
      );
  }

}
