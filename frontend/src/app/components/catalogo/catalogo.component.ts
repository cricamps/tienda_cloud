import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { TiendaService } from '../../services/tienda.service';
import { Producto } from '../../models/tienda.models';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NavbarComponent],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  cargando = true;
  error = '';
  busqueda = '';
  categoriaSeleccionada = 'Todas';
  categorias: string[] = [];
  toast = '';

  // Mapa de iconos por tipo
  private iconos: Record<string, string> = {
    granos:   '🌾',
    aceite:   '🫙',
    azucar:   '🍬',
    leche:    '🥛',
    pan:      '🍞',
    huevos:   '🥚',
    fideos:   '🍝',
    conserva: '🥫',
    default:  '📦'
  };

  constructor(public tiendaService: TiendaService) {}

  ngOnInit(): void {
    this.tiendaService.getProductos().subscribe({
      next: (productos) => {
        this.productos = productos;
        this.productosFiltrados = productos;
        this.categorias = ['Todas', ...new Set(productos.map(p => p.categoria))];
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar productos: ' + err.message;
        this.cargando = false;
      }
    });
  }

  getIcono(tipo: string): string {
    return this.iconos[tipo] ?? this.iconos['default'];
  }

  filtrar(): void {
    this.productosFiltrados = this.productos.filter(p => {
      const matchBusqueda = p.nombre.toLowerCase().includes(this.busqueda.toLowerCase()) ||
                            p.descripcion.toLowerCase().includes(this.busqueda.toLowerCase());
      const matchCategoria = this.categoriaSeleccionada === 'Todas' || p.categoria === this.categoriaSeleccionada;
      return matchBusqueda && matchCategoria;
    });
  }

  agregarAlCarrito(producto: Producto, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.tiendaService.agregarAlCarrito(producto);
    this.mostrarToast(`✅ ${producto.nombre} agregado`);
  }

  quitarDelCarrito(productoId: number, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.tiendaService.cambiarCantidad(productoId, this.tiendaService.getCantidadEnCarrito(productoId) - 1);
  }

  mostrarToast(msg: string): void {
    this.toast = msg;
    setTimeout(() => this.toast = '', 2500);
  }
}
