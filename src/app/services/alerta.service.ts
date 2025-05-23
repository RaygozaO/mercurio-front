import Swal from 'sweetalert2';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertaService {

  success(msg: string) {
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: msg,
      timer: 3000,
      showConfirmButton: false,
      toast: true,
      position: 'center'
    });
  }

  error(msg: string) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: msg,
      timer: 3000,
      showConfirmButton: false,
      toast: true,
      position: 'center'
    });
  }

  warning(msg: string) {
    Swal.fire({
      icon: 'warning',
      title: 'Advertencia',
      text: msg,
      toast: true,
      timer: 3000,
      showConfirmButton: false,
      position: 'center'
    });
  }

  info(msg: string) {
    Swal.fire({
      icon: 'info',
      title: 'Información',
      text: msg,
      timer: 3000,
      showConfirmButton: false,
      toast: true,
      position: 'center'
    });
  }

  confirm(msg: string): Promise<boolean> {
    return Swal.fire({
      icon: 'question',
      title: '¿Estás seguro?',
      text: msg,
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar'
    }).then(result => result.isConfirmed);
  }
}
