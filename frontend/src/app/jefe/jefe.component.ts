import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-jefe',
  templateUrl: './jefe.component.html',
  styleUrls: ['./jefe.component.css']
})
export class JefeComponent {
  mostrarFormulario = false;
  mostrarFormularioModificar = false; // Controla la visibilidad del formulario de modificar
  cursosPendientes: any[] = [];
  cursoSeleccionado: any = null; // Almacena el curso seleccionado para modificar

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

  constructor(private http: HttpClient) {
    this.obtenerCursosPendientes(); // Llamar a la función al iniciar el componente
  }

  abrirFormularioModificar(curso: any) {
    this.cursoSeleccionado = curso;
    this.mostrarFormularioModificar = true;

    // Cargar los datos del curso seleccionado en el formulario
    this.nombreCurso = curso.nombre_curso;
    this.asignaturasRequeridas = curso.asignaturas_requeridas;
    this.contenidosRequeridos = curso.contenidos_requeridos;
    this.numeroDocentes = curso.numero_docentes;
    this.tipoAsignatura = curso.tipo_asignatura;
    this.actividadEvento = curso.actividad_evento;
    this.objetivo = curso.objetivo;
    this.carrerasAtendidas = curso.carreras_atendidas;
    this.periodo = curso.periodo;
    this.turno = curso.turno;
    this.fechaInicio = curso.fecha_inicio; // Asegúrate de que el campo sea correcto
    this.fechaFin = curso.fecha_fin;       // Asegúrate de que el campo sea correcto
    this.justificacion = curso.justificacion;
    this.numeroHoras = curso.numero_horas;
    this.horario = curso.horario;
    this.lugar = curso.lugar;
    this.requisitos = curso.requisitos;
    this.tipoCurso = curso.tipo_curso;

    // Instructor
    this.nombreInstructor = curso.nombre_instructor;
    this.apellidopaternoInstructor = curso.apellidopaterno_instructor;
    this.apellidomaternoInstructor = curso.apellidomaterno_instructor;
    this.curpInstructor = curso.curp_instructor;
    this.rfcInstructor = curso.rfc_instructor;
    this.maxestudiosInstructor = curso.maxestudios_instructor;
    this.emailInstructor = curso.email_instructor;
    this.sexoInstructor = curso.sexo_instructor;
    this.tipoContratoInstructor = curso.tipo_contrato_instructor;
  }
  modificarCursoConfirmado() {
    // Eliminar el curso anterior en el orden especificado
    this.eliminarCurso(this.cursoSeleccionado.id)
      .subscribe(() => {
        // Proponer el nuevo curso con los datos modificados
        this.proponerCurso();
        Swal.fire({
          icon: 'success',
          title: 'Cambios Guardados',
          text: 'El curso ha sido modificado exitosamente.',
          confirmButtonText: 'Aceptar',
          background: '#f0f0f0',
          color: '#333',
          confirmButtonColor: '#007bff'
        });
      }, error => {
        console.error('Error al eliminar el curso:', error);
      });
  }
  eliminarCurso(cursoId: number) {
    // Eliminar primero de `departamento_curso`, luego `departamentos` y finalmente `cursos_propuestos`
    return this.http.delete(`http://localhost:3000/eliminar-curso/${cursoId}`);
  }
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
  obtenerCursosPendientes() {
    this.http.get<any[]>('http://localhost:3000/cursos-pendientes')
      .subscribe(response => {
        this.cursosPendientes = response; // Almacenar la respuesta en la variable
      }, error => {
        console.error('Error al obtener cursos pendientes:', error);
      });
  }
  modificarCurso(curso: any) {
    // Aquí puedes implementar la lógica para modificar el curso,
    // por ejemplo, abrir un formulario para editar el curso.
    console.log('Modificar curso:', curso);
  }

}