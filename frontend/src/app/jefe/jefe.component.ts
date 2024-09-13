import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-jefe',
  templateUrl: './jefe.component.html',
  styleUrls: ['./jefe.component.css']
})
export class JefeComponent {
  mostrarFormulario = false;
  nombreCurso = '';
  asignaturasRequeridas = '';
  contenidosRequeridos = '';
  numeroDocentes = 0;
  tipoAsignatura = '';
  actividadEvento = '';
  objetivo = '';
  carrerasAtendidas = '';
  periodo = '';
  facilitadoresPropuestos = '';
  turno = '';
  fechaInicio = '';
  fechaFin = '';
  justificacion = '';
  numeroHoras = 0;
  horario = '';
  lugar = '';
  requisitos = '';
  tipoCurso = '';

  constructor(private http: HttpClient) {}

  proponerCurso() {
    const curso = {
      nombre_curso: this.nombreCurso,
      asignaturas_requeridas: this.asignaturasRequeridas,
      contenidos_requeridos: this.contenidosRequeridos,
      numero_docentes: this.numeroDocentes,
      tipo_asignatura: this.tipoAsignatura,
      actividad_evento: this.actividadEvento,
      objetivo: this.objetivo,
      carreras_atendidas: this.carrerasAtendidas,
      periodo: this.periodo,
      facilitadores_propuestos: this.facilitadoresPropuestos,
      turno: this.turno,
      fecha_inicio: this.fechaInicio,
      fecha_fin: this.fechaFin,
      justificacion: this.justificacion,
      numero_horas: this.numeroHoras,
      horario: this.horario,
      lugar: this.lugar,
      requisitos: this.requisitos,
      tipo_curso: this.tipoCurso
    };

    this.http.post('http://localhost:3000/proponer-curso', curso)
      .subscribe(response => {
        console.log('Curso propuesto:', response);
        this.mostrarFormulario = false;  // Cerrar el formulario al enviar los datos
      }, error => {
        console.error('Error al proponer el curso:', error);
      });
  }
}
