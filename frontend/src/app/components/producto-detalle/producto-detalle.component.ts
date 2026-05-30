import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { TiendaService } from '../../services/tienda.service';
import { Producto } from '../../models/tienda.models';

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './producto-detalle.component.html',
  styleUrls: ['./producto-detalle.component.css']
})
export class ProductoDetalleComponent implements OnInit {
  producto: Producto | null = null;
  cargando = true;
  toast = '';

  private iconos: Record<string, string> = {
    granos: '🌾', aceite: '🫙', azucar: '🍬', leche: '🥛',
    pan: '🍞', huevos: '🥚', fideos: '🍝', conserva: '🥫', default: '📦'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public tiendaService: TiendaService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.tiendaService.getProductos().subscribe({
      next: (productos) => {
        this.producto = productos.find(p => p.id === id) ?? null;
        this.cargando = false;
      },
      error: () => { this.cargando = false; }
    });
  }

  getIcono(tipo: string): string {
    return this.iconos[tipo] ?? this.iconos['default'];
  }

  agregar(): void {
    if (this.producto) {
      this.tiendaService.agregarAlCarrito(this.producto);
      this.toast = '✅ Agregado al carrito';
      setTimeout(() => this.toast = '', 2000);
    }
  }

  quitar(): void {
    if (this.producto) {
      this.tiendaService.cambiarCantidad(
        this.producto.id,
        this.tiendaService.getCantidadEnCarrito(this.producto.id) - 1
      );
    }
  }

  get cantidad(): number {
    return this.producto ? this.tiendaService.getCantidadEnCarrito(this.producto.id) : 0;
  }

  irAlCarrito(): void { this.router.navigate(['/carrito']); }
  volver(): void { this.router.navigate(['/catalogo']); }
}
