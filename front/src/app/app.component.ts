import { Component, OnInit } from '@angular/core';
import { ComunicacionService } from './comunicacion.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  maestros: any[] = [];

  constructor(private comunicacionService: ComunicacionService) {}

  ngOnInit() {
    this.comunicacionService.getMaestros().subscribe(
      (data) => {
        this.maestros = data; // Guarda los datos en la variable maestros
      },
      (error) => {
        console.error('Error al obtener maestros', error);
      }
    );
  }
}
