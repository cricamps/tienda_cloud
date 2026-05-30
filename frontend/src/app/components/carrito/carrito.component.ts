import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { TiendaService } from '../../services/tienda.service';
import { Boleta } from '../../models/tienda.models';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent {
  boleta: Boleta | null = null;
  generando = false;
  error = '';

  constructor(
    public tiendaService: TiendaService,
    private router: Router
  ) {}

  get subtotal(): number { return this.tiendaService.totalCarrito(); }
  get iva(): number { return Math.round(this.subtotal * 0.19 * 100) / 100; }
  get total(): number { return Math.round((this.subtotal + this.iva) * 100) / 100; }

  cambiarCantidad(productoId: number, delta: number): void {
    const actual = this.tiendaService.getCantidadEnCarrito(productoId);
    this.tiendaService.cambiarCantidad(productoId, actual + delta);
  }

  eliminar(productoId: number): void {
    this.tiendaService.quitarDelCarrito(productoId);
  }

  seguirComprando(): void {
    this.router.navigate(['/catalogo']);
  }

  generarBoleta(): void {
    if (this.tiendaService.carrito().length === 0) return;
    this.generando = true;
    this.error = '';

    const request = {
      items: this.tiendaService.carrito().map(i => ({
        productoId: i.producto.id,
        nombre: i.producto.nombre,
        precio: i.producto.precio,
        cantidad: i.cantidad
      }))
    };

    this.tiendaService.generarBoleta(request).subscribe({
      next: (b) => {
        this.boleta = b;
        this.tiendaService.limpiarCarrito();
        this.generando = false;
      },
      error: (err) => {
        this.error = 'Error al generar boleta: ' + err.message;
        this.generando = false;
      }
    });
  }

  nuevaCompra(): void {
    this.boleta = null;
    this.router.navigate(['/catalogo']);
  }
}
