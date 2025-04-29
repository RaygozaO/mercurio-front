export interface Paciente {
  idcliente: number;
  nombrecliente: string;
  apellidopaterno: string;
  apellidomaterno: string;
  telefono: string;
  id_usuario?: number;
  id_domicilio?: number;
}

export interface Usuario {
  idusuario: number;
  nombreusuario: string;
  email: string;
  password: string;
  password2: string;
  enabled?: boolean;
  id_rol?: number;
}
export interface Colonia {
  idcolonia: number;
  nombrecolonia: string;
  idmunicipio: number;
  nombremunicipio: string;
  identidadfederativa: number;
  nombreentidad: string;
}

export interface Domicilio {
  coloniasSelected: Colonia | null;
  iddireccioncliente: number;
  calle: string;
  numero: string;
  interior: string;
  codigopostal: string;
  colonias: Colonia[];
  municipio: string;
  entidad: string;

  // IDs necesarios para insertar:
  id_cp?: number;
  id_colonia?: number;
  id_municipio?: number;
  id_entidad?: number;
}

export interface Rol {
  idroles: number;
  nombrerol: string;
  enabled: boolean;
}
