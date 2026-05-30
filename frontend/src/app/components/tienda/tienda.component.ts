import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MsalService } from '@azure/msal-angular';
import { TiendaService } from '../../services/tienda.service';
import { Boleta, ItemCarrito, Producto } from '../../models/tienda.models';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-tienda',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tienda.component.html',
  styleUrls: ['./tienda.component.css']
})
export class TiendaComponent implements OnInit {

  productos: Producto[] = [];
  carrito: ItemCarrito[] = [];
  boleta: Boleta | null = null;
  cargandoProductos = false;
  cargandoBoleta = false;
  error = '';
  vista: 'tienda' | 'boleta' = 'tienda';
  iniciando = true;
  logueado = false;

  constructor(
    private tiendaService: TiendaService,
    private msalService: MsalService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      await this.msalService.instance.initialize();

      // Procesa redirect de vuelta desde B2C
      const redirectResult = await this.msalService.instance.handleRedirectPromise();
      if (redirectResult?.account) {
        this.msalService.instance.setActiveAccount(redirectResult.account);
      }

      const accounts = this.msalService.instance.getAllAccounts();

      if (accounts.length > 0) {
        this.msalService.instance.setActiveAccount(accounts[0]);
        this.logueado = true;
        this.iniciando = false;
        this.cargarProductos();
      } else {
        // Sin sesión → redirect a Azure B2C (sin popup)
        this.iniciando = false;
        await this.msalService.instance.loginRedirect({
          scopes: [...environment.loginRequest.scopes, ...environment.apiScopes]
        });
      }

    } catch (err: any) {
      console.error('Error MSAL init:', err);
      this.error = 'Error al inicializar MSAL: ' + (err?.message ?? JSON.stringify(err));
      this.iniciando = false;
    }
  }

  get nombreUsuario(): string {
    return this.tiendaService.getNombreUsuario();
  }

  cargarProductos(): void {
    this.cargandoProductos = true;
    this.error = '';
    this.tiendaService.getProductos().subscribe({
      next: (productos) => {
        this.productos = productos;
        this.cargandoProductos = false;
      },
      error: (err) => {
        console.error('Error productos:', err);
        this.error = `Error al cargar productos (${err.status ?? err.message}): ${err.message ?? ''}`;
        this.cargandoProductos = false;
      }
    });
  }

  agregarAlCarrito(producto: Producto): void {
    const item = this.carrito.find(i => i.id === producto.id);
    if (item) { item.cantidad++; }
    else { this.carrito.push({ ...producto, cantidad: 1 }); }
  }

  quitarDelCarrito(productoId: number): void {
    const item = this.carrito.find(i => i.id === productoId);
    if (!item) return;
    if (item.cantidad > 1) { item.cantidad--; }
    else { this.carrito = this.carrito.filter(i => i.id !== productoId); }
  }

  getCantidadEnCarrito(productoId: number): number {
    return this.carrito.find(i => i.id === productoId)?.cantidad ?? 0;
  }

  get totalCarrito(): number {
    return this.carrito.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
  }

  get totalItems(): number {
    return this.carrito.reduce((acc, i) => acc + i.cantidad, 0);
  }

  generarBoleta(): void {
    if (this.carrito.length === 0) return;
    this.cargandoBoleta = true;
    const request = {
      items: this.carrito.map(i => ({
        productoId: i.id,
        nombre: i.nombre,
        precio: i.precio,
        cantidad: i.cantidad
      }))
    };
    this.tiendaService.generarBoleta(request).subscribe({
      next: (boleta) => {
        this.boleta = boleta;
        this.vista = 'boleta';
        this.cargandoBoleta = false;
      },
      error: (err) => {
        console.error('Error boleta:', err);
        this.error = `Error al generar boleta: ${err.status} ${err.message}`;
        this.cargandoBoleta = false;
      }
    });
  }

  nuevaCompra(): void {
    this.carrito = [];
    this.boleta = null;
    this.vista = 'tienda';
  }

  logout(): void {
    this.msalService.instance.logoutRedirect();
  }
}
