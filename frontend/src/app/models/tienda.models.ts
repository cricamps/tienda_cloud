export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagen: string;
  stock: number;
  detalle: string;
}

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

export interface BoletaRequest {
  items: { productoId: number; nombre: string; precio: number; cantidad: number }[];
}

export interface Boleta {
  numeroBoleta: string;
  cliente: string;
  fecha: string;
  items: { productoId: number; nombre: string; precio: number; cantidad: number }[];
  subtotal: number;
  iva: number;
  total: number;
}

export interface Perfil {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
}
