import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-encuestajefe',
  templateUrl: './encuestajefe.component.html',
  styleUrls: ['./encuestajefe.component.css']
})
export class EncuestajefeComponent implements OnInit {
  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  @Input() cursoNombre: string = '';
  @Input() idMaestro!: number;

  usuarioId: number = 0;
  cursoId: number | null = null;
  respuestas: number[] = Array(13).fill(0);
  sugerencias: string = '';
  encuestaRespondida: boolean = false;
  private apiUrl = 'http://localhost:3000/api/encuesta';

  preguntas: string[] = [
    'LOS CONOCIMIENTOS QUE ADQUIRIÓ SU COLABORADOR(A) EN EL CURSO TIENE APLICACIÓN EN EL ÁMBITO LABORAL A CORTO Y MEDIANO PLAZO.',
    'EL CURSO AYUDÓ A SU COLABORADOR(A) A MEJORAR EL DESEMPEÑO DE SUS FUNCIONES.',
    'EL CURSO AYUDÓ A SU COLABORADOR(A) A CONSIDERAR NUEVAS FORMAS DE TRABAJO.',
    'PRODUJO UN INCREMENTO EN SU MOTIVACIÓN.',
    'HA SERVIDO PARA SU DESARROLLO PERSONAL.',
    'SIRVIÓ PARA INTEGRARME MEJOR CON SUS COMPAÑEROS(AS) DE TRABAJO.',
    'PRODUJO UNA MAYOR COMPRENSIÓN DEL SERVICIO QUE PRESTA EL SNEST.',
    'FACILITÓ UNA MEJORÍA EN SU ACTITUD HACIA LA INSTITUCIÓN O SUS COMPAÑEROS(AS) DE TRABAJO.',
    'PERMITIÓ QUE DESARROLLARA ALGUNAS HABILIDADES ADICIONALES.',
    'GENERÓ UNA MEJOR COMPRENSIÓN DE LOS CONCEPTOS GENERALES DEL CURSO APLICABLES A SU CAMPO LABORAL.',
    'RELACIONARON LOS CONOCIMIENTOS IMPARTIDOS DEL CURSO CON LA DOCENCIA.',
    'OFRECIERON UN SENTIDO ÉTICO Y MORAL PARA MEJORAR SUS ASPECTOS LABORALES.',
    'OFRECIERON VALORES COMPATIBLES CON LOS SUYOS.'
  ];

  ngOnInit(): void {
    const storedUserId = localStorage.getItem('userId');
    this.usuarioId = storedUserId ? parseInt(storedUserId, 10) : 0;

    console.log('ID del Maestro:', this.idMaestro); // Verifica que idMaestro tenga un valor
    console.log('ID del Usuario:', this.usuarioId);

    this.obtenerCursoId(this.cursoNombre);
  }


  obtenerCursoId(cursoNombre: string): void {
    this.http.get<{ id: number }>(`${this.apiUrl}/obtenerCursoId?nombre_curso=${cursoNombre}&estado=aceptado`)
      .subscribe(
        (response) => {
          this.cursoId = response.id;
        },
        (error) => {
          console.error('Error al obtener el ID del curso:', error);
        }
      );
  }

  enviarEncuesta(): void {
    // Verificar si todas las preguntas tienen una respuesta seleccionada
    if (this.respuestas.includes(0)) {
      alert('Por favor, responde todas las preguntas antes de enviar la encuesta.');
      return;
    }
  
    // Verificar si las sugerencias han sido proporcionadas
    if (this.sugerencias.trim() === '') {
      alert('Por favor, escribe tus sugerencias antes de enviar la encuesta.');
      return;
    }
  
    if (this.cursoId === null) {
      console.error('El ID del curso no está disponible');
      return;
    }
  
    const data = {
      usuarioId: this.usuarioId,
      cursoId: this.cursoId,
      idMaestro: this.idMaestro,
      respuestas: this.respuestas,
      sugerencias: this.sugerencias
    };
  
    this.http.post(`${this.apiUrl}/guardar`, data).subscribe(
      response => {
        console.log('Encuesta enviada con éxito:', response);
        this.encuestaRespondida = true;
  
        // Actualizar encuestajefes en la tabla usuario_requisitos
        this.actualizarEncuestaJefes();
      },
      error => {
        if (error.status === 400 && error.error.error === 'La encuesta ya ha sido respondida') {
          alert('Ya has respondido a esta encuesta.');
        } else {
          console.error('Error al enviar la encuesta:', error);
        }
      }
    );
  }
  

  actualizarEncuestaJefes(): void {
    const updateData = { idMaestro: this.idMaestro, cursoId: this.cursoId };

    this.http.post(`${this.apiUrl}/actualizarEncuestaJefes`, updateData).subscribe(
      () => {
        console.log('Campo encuestajefes actualizado correctamente para el maestro.');
      },
      error => {
        console.error('Error al actualizar encuestajefes:', error);
      }
    );
  }


}
