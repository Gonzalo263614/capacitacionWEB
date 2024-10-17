import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-jefe',
  templateUrl: './jefe.component.html',
  styleUrls: ['./jefe.component.css']
})
export class JefeComponent {
  mostrarFormulario = false;

  // Datos del curso
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

  // Datos del instructor
  nombreInstructor = '';
  apellidopaternoInstructor = '';
  apellidomaternoInstructor = '';
  curpInstructor = '';
  rfcInstructor = '';
  maxestudiosInstructor = '';
  emailInstructor = '';
  // Datos del instructor
  sexoInstructor = '';
  tipoContratoInstructor = '';

  // Contraseña generada automáticamente
  passwordInstructor = 'contraseña1234';  // Contraseña predeterminada

  departamentosAcademicos = [
    'Ciencias Básicas',
    'Ciencias Económico - Administrativas',
    'Desarrollo Académico',
    'Eléctrica - Electrónica',
    'Ingeniería Industrial',
    'Metal - Mecánica',
    'Sistemas y Computación',
    'Química y Bioquímica'
  ];
  departamentosSeleccionados: string[] = [];

  constructor(private http: HttpClient) { }

  onCheckboxChange(departamento: string, event: any) {
    if (event.target.checked) {
      // Si se selecciona, lo agregamos a la lista de seleccionados
      this.departamentosSeleccionados.push(departamento);
    } else {
      // Si se deselecciona, lo eliminamos de la lista de seleccionados
      const index = this.departamentosSeleccionados.indexOf(departamento);
      if (index > -1) {
        this.departamentosSeleccionados.splice(index, 1);
      }
    }
    // Imprimir la lista actualizada de departamentos seleccionados
    console.log('Departamentos seleccionados:', this.departamentosSeleccionados);
  }

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
      turno: this.turno,
      fecha_inicio: this.fechaInicio,
      fecha_fin: this.fechaFin,
      justificacion: this.justificacion,
      numero_horas: this.numeroHoras,
      horario: this.horario,
      lugar: this.lugar,
      requisitos: this.requisitos,
      tipo_curso: this.tipoCurso,
      // Datos del instructor
      nombre_instructor: this.nombreInstructor,
      apellidopaterno_instructor: this.apellidopaternoInstructor,
      apellidomaterno_instructor: this.apellidomaternoInstructor,
      curp_instructor: this.curpInstructor,
      rfc_instructor: this.rfcInstructor,
      maxestudios_instructor: this.maxestudiosInstructor,
      email_instructor: this.emailInstructor,
      sexo_instructor: this.sexoInstructor,
      tipo_contrato_instructor: this.tipoContratoInstructor,
      password_instructor: this.passwordInstructor,
      // Departamentos seleccionados
      departamentosSeleccionados: this.departamentosSeleccionados
    };

    this.http.post('http://localhost:3000/proponer-curso', curso)
      .subscribe(response => {
        console.log('Curso propuesto:', response);
        this.mostrarFormulario = false;
        // Limpiar campos y resetear array de departamentos seleccionados
        this.limpiarFormulario();
      }, error => {
        console.error('Error al proponer el curso:', error);
      });
  }
  // Función para limpiar el formulario y resetear el array de departamentos seleccionados
  limpiarFormulario() {
    this.nombreCurso = '';
    this.asignaturasRequeridas = '';
    this.contenidosRequeridos = '';
    this.numeroDocentes = 0;
    this.tipoAsignatura = '';
    this.actividadEvento = '';
    this.objetivo = '';
    this.carrerasAtendidas = '';
    this.periodo = '';
    this.turno = '';
    this.fechaInicio = '';
    this.fechaFin = '';
    this.justificacion = '';
    this.numeroHoras = 0;
    this.horario = '';
    this.lugar = '';
    this.requisitos = '';
    this.tipoCurso = '';
    this.nombreInstructor = '';
    this.apellidopaternoInstructor = '';
    this.apellidomaternoInstructor = '';
    this.curpInstructor = '';
    this.rfcInstructor = '';
    this.maxestudiosInstructor = '';
    this.emailInstructor = '';
    this.sexoInstructor = '';
    this.tipoContratoInstructor = '';
    this.passwordInstructor = 'contraseña1234';  // Restaurar contraseña predeterminada

    // Reiniciar el array de departamentos seleccionados
    this.departamentosSeleccionados = [];
  }
}
