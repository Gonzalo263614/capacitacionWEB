import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.css']
})
export class EncuestaComponent {

  @Input() cursoNombre: string = '';

  respuestas: number[] = Array(13).fill(0); // Array para almacenar las respuestas
  respuestas2: number[] = Array(7).fill(0); // Array para almacenar las respuestas
  respuestas3: number[] = Array(2).fill(0); // Array para almacenar las respuestas
  respuestas4: number[] = Array(4).fill(0); // Array para almacenar las respuestas
  respuestas5: number[] = Array(6).fill(0); // Array para almacenar las respuestas
  sugerencias: string = ''; // Variable para almacenar las sugerencias del us
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
  enviarEncuesta(): void {
    console.log('Respuestas de la encuesta:', this.respuestas);
    console.log('Respuestas de la encuesta:', this.respuestas2);
    console.log('Respuestas de la encuesta:', this.respuestas3);
    console.log('Respuestas de la encuesta:', this.respuestas4);
    console.log('Respuestas de la encuesta:', this.respuestas5);
    console.log('Sugerencias:', this.sugerencias);
    // Aquí puedes enviar las respuestas a tu backend o hacer algo con ellas
    alert('Encuesta enviada');
  }
}
