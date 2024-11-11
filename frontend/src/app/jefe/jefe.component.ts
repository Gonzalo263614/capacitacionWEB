import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

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

  mostrarFormulario2: boolean = false;
  cursosPropuestos: any[] = [];
  showEncuesta: { [key: number]: boolean } = {}; // Control para mostrar encuestas por ID de curso

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
  // Enfoque de curso
  enfoqueCurso = '';


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

  selectedFile: File | null = null;
  uploadSuccess: boolean | null = null;
  uploadError: boolean | null = null;

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
  idJefe = 1;  // Por ejemplo, esto podría provenir del sistema de autenticación

  constructor(private http: HttpClient,private route: ActivatedRoute) {
    this.obtenerCursosPendientes(); // Llamar a la función al iniciar el componente
  }
  ngOnInit(): void {
    // Obtener el idJefe del localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedIdJefe = localStorage.getItem('userId');
      if (storedIdJefe) {
        this.idJefe = parseInt(storedIdJefe, 10);  // Convertir a número
        // Llamar a obtenerCursosPropuestos con el idJefe
        this.obtenerCursosPropuestos(this.idJefe);
      } else {
        console.error('No se encontró el ID del jefe en localStorage.');
      }
    }
    // Aquí puedes continuar con otras inicializaciones si es necesario
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
    // Convertir fecha al formato YYYY-MM-DD
    this.fechaInicio = formatDate(curso.fecha_inicio, 'yyyy-MM-dd', 'en');
    this.fechaFin = formatDate(curso.fecha_fin, 'yyyy-MM-dd', 'en');
    this.justificacion = curso.justificacion;
    this.numeroHoras = curso.numero_horas;
    this.horario = curso.horario;
    this.lugar = curso.lugar;
    this.requisitos = curso.requisitos;
    this.tipoCurso = curso.tipo_curso;
    this.enfoqueCurso = curso.enfoque_curso;
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
    // Cargar los departamentos del curso seleccionado
    if (curso.departamentos && Array.isArray(curso.departamentos)) {
      this.departamentosSeleccionados = curso.departamentos.map((departamento: any) => departamento.nombre);
    } else {
      this.departamentosSeleccionados = [];
    }
    console.log('Departamentos seleccionados al abrir formulario:', this.departamentosSeleccionados);
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
      enfoque_curso: this.enfoqueCurso,
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
      departamentosSeleccionados: this.departamentosSeleccionados,
      id_jefe: this.idJefe  // Enviar el ID del jefe junto con el curso
    };

    this.http.post('http://localhost:3000/proponer-curso', curso)
      .subscribe(response => {
        console.log('Curso propuesto:', response);
        this.mostrarFormulario = false;
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
    this.enfoqueCurso = '';
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

  obtenerCursosPropuestos(idJefe: number): void {
    this.http.get<any[]>(`http://localhost:3000/jefe/${idJefe}/cursos`).subscribe({
      next: (cursos) => {
        this.cursosPropuestos = cursos;
        // Para cada curso, obtener los maestros inscritos
        this.cursosPropuestos.forEach(curso => {
          this.http.get<any[]>(`http://localhost:3000/curso/${curso.id}/maestros`).subscribe({
            next: (maestros) => curso.maestrosInscritos = maestros,
            error: (err) => console.error(`Error al obtener maestros del curso ${curso.id}:`, err)
          });
        });
      },
      error: (err) => console.error('Error al obtener cursos propuestos:', err)
    });
  }


  // Dentro de la clase JefeComponent
  encuestaVisible: { [cursoId: number]: number | null } = {};

  toggleEncuesta(cursoId: number): void {
    this.showEncuesta[cursoId] = !this.showEncuesta[cursoId];
  }

  responderEncuesta(maestroId: number, cursoId: number): void {
    // Alternar visibilidad: mostrar solo si actualmente está oculto
    this.encuestaVisible[cursoId] = this.encuestaVisible[cursoId] === maestroId ? null : maestroId;
  }
  cerrarFormulario() {
    this.mostrarFormularioModificar = false;
  }
  // Manejar la selección del archivo
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  // Enviar el archivo al servidor
  onSubmit() {
    
    const usuarioId = localStorage.getItem('userId');
    const formData = new FormData();
    console.log(usuarioId);

    if (!usuarioId || !cursoId) {
      console.error('usuarioId o cursoId son null. Asegúrate de que existen en la ruta.');
      return;
    }

    if (this.selectedFile) {
      formData.append('archivo', this.selectedFile);
      formData.append('usuarioId', usuarioId);
      formData.append('cursoId', cursoId);

      this.http.post('http://localhost:3000/uploads2', formData, { responseType: 'text' })
        .subscribe({
          next: (response) => {
            console.log('Respuesta del servidor:', response);
            this.uploadSuccess = true;
          },
          error: (error) => {
            console.error('Error al subir archivo', error);
            this.uploadError = true;
          }
        });
    }
  }
}