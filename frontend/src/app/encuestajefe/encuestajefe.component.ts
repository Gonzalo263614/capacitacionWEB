import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-encuestajefe',
  templateUrl: './encuestajefe.component.html',
  styleUrl: './encuestajefe.component.css'
})
export class EncuestajefeComponent implements OnInit {
  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  @Input() cursoNombre: string = '';
  @Input() idMaestro!: number;   // Agregar este nuevo input para el ID del maestro
  
  usuarioId: number = 0;
  cursoId: string | null = '';
  idInscripcion: number | null = null;

  respuestas: number[] = Array(13).fill(0);
  sugerencias: string = '';
  encuestaRespondida: boolean = false; // Nueva propiedad
  private apiUrl = 'http://localhost:3000/api/encuesta';

  preguntas: string[] = [
    'LOS CONOCIMIENTOS QUE ADQUIRIÓ SU COLABORADOR(A) EN EL CURSO TIENE APLICACIÓN EN EL ÁMBITO LABORAL A CORTO Y MEDIANO PLAZO.',
    'EL CURSO AYUDÓ A SU COLABORADOR(A) A MEJORAR EL DESEMPEÑO DE SUS FUNCIONES.',
    'EL CURSO AYUDÓ A SU COLABORADOR(A) A CONSIDERAR NUEVAS FORMAS DE TRABAJO.',
    'PRODUJO UN INCREMENTO EN SU MOTIVACIÓN.',
    'HA SERVIDO PARA SU DESARROLLO PERSONAL.',
    'SIRVIÓ PARA INTEGRARME MEJOR CON SUS COMPAÑEROS(AS) DE TRABAJO.',
    'PRODUJO UNA MAYOR COMPRENSIÓN DEL SERVICIO QUE PRESTA EL SNEST.',
    'FALICITÓ UNA MEJORÍA EN SU ACTITUD HACIA LA INSTITUCIÓN O SUS COMPAÑEROS(AS) DE TRABAJO.',
    'PERMITIÓ QUE DESARROLLARA ALGUNAS HABILIDADES ADICIONALES.',
    'GENERÓ UNA MEJOR COMPRENSIÓN DE LOS CONCEPTOS GENERALES DEL CURSO APLICABLES A SU CAMPO LABORAL.',
    'RELACIONARON LOS CONOCIMIENTOS IMPARTIDOS DEL CURSO CON LA DOCENCIA.',
    'OFRECIERON UN SENTIDO ÉTICO Y MORAL PARA MEJORAR SUS ASPECTOS LABORALES.',
    'OFRECIERON VALORES COMPATIBLES CON LOS SUYOS.'
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
      sugerencias: this.sugerencias
    };

    this.http.post(this.apiUrl, encuestaData).subscribe(
      response => {
        console.log('Encuesta enviada:', response);
        alert('Encuesta enviada');
        this.encuestaRespondida = true;
      },
      error => {
        console.error('Error al enviar la encuesta:', error);
        alert('Error al enviar la encuesta');
      }
    );
  }
}