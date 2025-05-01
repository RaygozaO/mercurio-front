
// modelo del producto
export interface Producto {
  idproductos: number;
  nombre: string;
  codigobar: string;
  precio: number;
  presentacion: string;
  gramaje: string;
  enabled: boolean;
  fotografia?: string;
  ventas_idventas: number;
  stock_idstock: number;
  stock: number;
}
