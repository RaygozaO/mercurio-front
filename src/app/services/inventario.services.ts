import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import {Observable} from 'rxjs';
import {Producto} from '../ventas/producto.model';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private apiUrl = `${environment.apiBaseUrl}/productos`;

  constructor(private http: HttpClient) {}

  obtenerProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  obtenerProducto(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

  crearProducto(producto: Producto): Observable<any> {
    return this.http.post(this.apiUrl, producto);
  }

  actualizarProducto(id: number, producto: Producto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, producto);
  }

  obtenerFaltantes(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/faltantes`);
  }
}
