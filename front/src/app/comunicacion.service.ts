import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComunicacionService {

  private apiUrl = 'http://localhost:3000/maestros'; // URL de tu backend

  constructor(private http: HttpClient) { }

  // Método para obtener los maestros
  getMaestros(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
