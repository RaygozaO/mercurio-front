export interface Paciente {
  idcliente: number; // Si es auto-generado en la base de datos
  nombrecliente: string;
  apellidopaterno: string;
  apellidomaterno: string; // Si es opcional
  telefono: string; // Si es opcional
  id_usuario: number; // Para relacionar con el usuario
  id_domicilio: number; // Si es relevante
}

export interface Usuario {
  nombreusuario: string;
  email: string;
  password: string; // Considera cifrar esta contraseña antes de enviarla al servidor
  password2: string;
}
export interface Domicilio{
  coloniasSelected: string;
  iddireccioncliente: number;
  calle: string;
  numero: string;
  interior?: string;
  codigopostal: string;
  colonias: any[];
  municipio: string;
  entidad: string;
}
