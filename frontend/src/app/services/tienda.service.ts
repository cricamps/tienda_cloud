import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, switchMap } from 'rxjs';
import { MsalService } from '@azure/msal-angular';
import { environment } from '../../environments/environment';
import { Boleta, BoletaRequest, ItemCarrito, Perfil, Producto } from '../models/tienda.models';

@Injectable({ providedIn: 'root' })
export class TiendaService {

  private _carrito = signal<ItemCarrito[]>([]);
  carrito = this._carrito.asReadonly();

  totalItems = computed(() =>
    this._carrito().reduce((acc, i) => acc + i.cantidad, 0)
  );
  totalCarrito = computed(() =>
    this._carrito().reduce((acc, i) => acc + (i.producto?.precio ?? 0) * i.cantidad, 0)
  );

  constructor(private http: HttpClient, private msalService: MsalService) {}

  private getToken(): Observable<string> {
    try {
      const keys = Object.keys(localStorage);
      const idTokenKey = keys.find(k => k.toLowerCase().includes('idtoken'));
      if (idTokenKey) {
        const parsed = JSON.parse(localStorage.getItem(idTokenKey)!);
        if (parsed?.secret) return of(parsed.secret);
      }
    } catch {}
    return of('');
  }

  private getHeaders(): Observable<HttpHeaders> {
    return this.getToken().pipe(
      switchMap(token => of(new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })))
    );
  }

  getProductos(): Observable<Producto[]> {
    return this.getHeaders().pipe(
      switchMap(h => this.http.get<Producto[]>(`${environment.apiUrl}/productos`, { headers: h }))
    );
  }

  generarBoleta(request: BoletaRequest): Observable<Boleta> {
    return this.getHeaders().pipe(
      switchMap(h => this.http.post<Boleta>(`${environment.apiUrl}/boleta/generar`, request, { headers: h }))
    );
  }

  agregarAlCarrito(producto: Producto, cantidad = 1): void {
    this._carrito.update(carrito => {
      const idx = carrito.findIndex(i => i.producto.id === producto.id);
      if (idx >= 0) {
        const nuevo = [...carrito];
        const max = producto.stock ?? 99;
        nuevo[idx] = { ...nuevo[idx], cantidad: Math.min(nuevo[idx].cantidad + cantidad, max) };
        return nuevo;
      }
      return [...carrito, { producto, cantidad }];
    });
  }

  quitarDelCarrito(productoId: number): void {
    this._carrito.update(c => c.filter(i => i.producto.id !== productoId));
  }

  cambiarCantidad(productoId: number, cantidad: number): void {
    if (cantidad <= 0) { this.quitarDelCarrito(productoId); return; }
    this._carrito.update(carrito => {
      const idx = carrito.findIndex(i => i.producto.id === productoId);
      if (idx < 0) return carrito;
      const nuevo = [...carrito];
      nuevo[idx] = { ...nuevo[idx], cantidad };
      return nuevo;
    });
  }

  limpiarCarrito(): void { this._carrito.set([]); }

  getCantidadEnCarrito(productoId: number): number {
    return this._carrito().find(i => i.producto.id === productoId)?.cantidad ?? 0;
  }

  // ---- PERFIL: extrae nombre desde el JWT directamente ----
  getNombreUsuario(): string {
    // Primero intenta desde la cuenta MSAL
    const account = this.msalService.instance.getActiveAccount();
    if (account?.name && account.name.trim()) return account.name;
    if (account?.username && account.username.trim()) return account.username;

    // Si no hay nombre en el account, lo lee desde el idToken del localStorage
    try {
      const keys = Object.keys(localStorage);
      const idTokenKey = keys.find(k => k.toLowerCase().includes('idtoken'));
      if (idTokenKey) {
        const parsed = JSON.parse(localStorage.getItem(idTokenKey)!);
        if (parsed?.secret) {
          // Decodifica el payload del JWT (parte central)
          const payload = JSON.parse(atob(parsed.secret.split('.')[1]));
          if (payload.name) return payload.name;
          if (payload.given_name) return `${payload.given_name} ${payload.family_name ?? ''}`.trim();
          if (payload.emails?.[0]) return payload.emails[0];
          if (payload.email) return payload.email;
          if (payload.preferred_username) return payload.preferred_username;
        }
      }
    } catch {}

    return 'Usuario';
  }

  getEmailUsuario(): string {
    const account = this.msalService.instance.getActiveAccount();
    if (account?.username) return account.username;

    try {
      const keys = Object.keys(localStorage);
      const idTokenKey = keys.find(k => k.toLowerCase().includes('idtoken'));
      if (idTokenKey) {
        const parsed = JSON.parse(localStorage.getItem(idTokenKey)!);
        if (parsed?.secret) {
          const payload = JSON.parse(atob(parsed.secret.split('.')[1]));
          return payload.emails?.[0] ?? payload.email ?? payload.preferred_username ?? '';
        }
      }
    } catch {}

    return '';
  }

  getPerfil(): Perfil {
    const stored = localStorage.getItem('perfil_usuario');
    if (stored) {
      const p = JSON.parse(stored);
      // Actualiza nombre y email si aún son placeholder
      if (!p.nombre || p.nombre === 'Tu nombre') p.nombre = this.getNombreUsuario();
      if (!p.email || p.email === 'tu@email.com') p.email = this.getEmailUsuario();
      return p;
    }
    return {
      nombre: this.getNombreUsuario(),
      email: this.getEmailUsuario(),
      telefono: '',
      direccion: ''
    };
  }

  guardarPerfil(perfil: Perfil): void {
    localStorage.setItem('perfil_usuario', JSON.stringify(perfil));
  }
}
