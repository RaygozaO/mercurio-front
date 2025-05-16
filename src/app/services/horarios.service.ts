import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Horario {
  idhorarios: number;
  nombre_horario: string;
}

@Injectable({
  providedIn: 'root'
})
export class HorariosService {
  private apiUrl = 'http://localhost:3000/api/horarios'; // Ajusta URL si es necesario

  constructor(private http: HttpClient) {}

  obtenerHorarios(): Observable<Horario[]> {
    return this.http.get<Horario[]>(this.apiUrl);
  }
}
