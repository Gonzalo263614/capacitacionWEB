import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.css']
})
export class EncuestaComponent implements OnInit {
  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  @Input() cursoNombre: string = '';
  usuarioId: number = 0;
  cursoId: string | null = '';
  idInscripcion: number | null = null;

  respuestas: number[] = Array(13).fill(0);
  respuestas2: number[] = Array(7).fill(0);
  respuestas3: number[] = Array(2).fill(0);
  respuestas4: number[] = Array(4).fill(0);
  respuestas5: number[] = Array(6).fill(0);
  sugerencias: string = '';
  encuestaRespondida: boolean = false; // Nueva propiedad
  private apiUrl = 'http://localhost:3000/api/encuesta';
  preguntas: string[] = [
    'PERMITIÓ QUE LOS CONOCIMIENTOS ADQUIRIDOS TENGAN APLICACIÓN EN MI ÁMBITO LABORAL A CORTO Y MEDIANO PLAZO.',
    'AYUDÓ A MEJORAR EL DESEMPEÑO DE MIS FUNCIONES.',
    'AYUDÓ A CONSIDERAR NUEVAS FORMAS DE TRABAJO.',
    'PRODUJO UN INCREMENTO EN MI MOTIVACIÓN.',
    'HA SERVIDO PARA MI DESARROLLO PROFESIONAL.',
    'SIRVIÓ PARA INTEGRARME MEJOR CON MIS COMPAÑEROS(AS) DE TRABAJO.',
    'PRODUJO UNA MAYOR COMPRENSIÓN DEL SERVICIO QUE PRESTO EN EL ITA.',
    'FACILITÓ UNA MEJORÍA EN MI ACTITUD HACIA LA INSTITUCIÓN O MIS COMPAÑEROS(AS) DE TRABAJO.',
    'PERMITIÓ QUE DESARROLLARA ALGUNAS HABILIDADES ADICIONALES.',
    'GENERÓ UNA MEJOR COMPRENSIÓN DE LOS CONCEPTOS GENERALES DEL CURSO APLICABLES A MI CAMPO LABORAL.',
    'RELACIONÉ LOS CONOCIMIENTOS IMPARTIDOS DEL CURSO CON LA DOCENCIA.',
    'OFRECIERON UN SENTIDO ÉTICO Y MORAL PARA MEJORAR MIS ASPECTOS LABORALES.',
    'OFRECIERON VALORES COMPATIBLES CON LOS MÍOS.'
  ];

  preguntas2: string[] = [
    'EXPUSO EL OBJETIVO Y TEMARIO DEL CURSO',
    'MOSTRÓ DOMINIO DEL CONTENIDO ABORDADO.',
    'FOMENTÓ LA PARTICIPACIÓN DEL GRUPO.',
    'ACLARÓ LAS DUDAS QUE SE PRESENTARON.',
    'DIÓ RETROALIMENTACIÓN A LOS EJERCICIOS REALIZADOS.',
    'APLICÓ UNA EVALUACIÓN FINAL RELACIONADA CON LOS CONTENIDOS DEL CURSO.',
    'INICIÓ Y CONCLUYÓ PUNTUALMENTE A LAS SESIONES.'
  ];
  preguntas3: string[] = [
    'EL MATERIAL DIDÁCTICO FUE ÚTIL A LO LARGO DEL CURSO.',
    'LA VARIEDAD DE MATERIAL DIDÁCTICO FUE SUFICIENTE PARA APOYAR SU APRENDIZAJE.'
  ];
  preguntas4: string[] = [
    'LA DISTRIBUCIÓN DEL TIEMPO FUE ADECUADA PARA CUBRIR EL CONTENIDO.',
    'LOS TEMAS FUERON SUFICIENTES PARA ALCANZAR EL OBJETIVO DEL CURSO.',
    'EL CURSO COMPRENDIÓ EJERCICIOS DE PRÁCTICA RELACIONADOS CON EL CONTENIDO.',
    'EL CURSO CUBRIÓ MIS EXPECTATIVAS.'
  ];
  ngOnInit(): void {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      this.usuarioId = parseInt(storedUserId, 10);
    }

    this.cursoId = this.route.snapshot.paramMap.get('id');

    if (this.cursoId && this.usuarioId) {
      this.obtenerIdInscripcion();
    }
  }

  obtenerIdInscripcion(): void {
    this.http.get<any>(`http://localhost:3000/api/inscripcion/${this.cursoId}/${this.usuarioId}`)
      .subscribe({
        next: (response) => {
          this.idInscripcion = response.id;

          // Verifica si la encuesta ya fue respondida
          this.http.get<any>(`${this.apiUrl}/respondida/${this.idInscripcion}`)
            .subscribe({
              next: (data) => {
                this.encuestaRespondida = data.respondida;
              },
              error: (err) => {
                console.error('Error al verificar si la encuesta ya fue respondida:', err);
              }
            });
        },
        error: (err) => {
          console.error('Error al obtener id de inscripción:', err);
        }
      });
  }

  enviarEncuesta(): void {
    if (this.encuestaRespondida) {
      alert('Ya has respondido esta encuesta.');
      return;
    }

    if (!this.idInscripcion) {
      console.error('No se pudo obtener el id de inscripción');
      return;
    }

    const encuestaData = {
      id_inscripcion: this.idInscripcion,
      respuestas1: this.respuestas,
      respuestas2: this.respuestas2,
      respuestas3: this.respuestas3,
      respuestas4: this.respuestas4,
      sugerencias: this.sugerencias
    };

    this.http.post(this.apiUrl, encuestaData).subscribe(
      response => {
        console.log('Encuesta enviada:', response);
        alert('Encuesta enviada');
        this.encuestaRespondida = true;

        // Actualizar el campo encuesta1 en usuario_requisitos
        this.http.post(`http://localhost:3000/api/encuesta/actualizar-encuesta/${this.usuarioId}/${this.cursoId}`, {})
          .subscribe(
            () => console.log('Campo encuesta1 actualizado en usuario_requisitos'),
            err => console.error('Error al actualizar encuesta1 en usuario_requisitos:', err)
          );
      },
      error => {
        console.error('Error al enviar la encuesta:', error);
        alert('Error al enviar la encuesta');
      }
    );
  }

}