import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { TiendaService } from '../../services/tienda.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="nav-brand" routerLink="/">🛒 Tienda Don Pepe</div>
      <div class="nav-links">
        <a routerLink="/catalogo" routerLinkActive="active">Productos</a>
        <a routerLink="/carrito" routerLinkActive="active" class="nav-carrito">
          🧺 Carrito
          <span class="badge" *ngIf="tiendaService.totalItems() > 0">{{ tiendaService.totalItems() }}</span>
        </a>
        <a routerLink="/perfil" routerLinkActive="active">👤 {{ tiendaService.getNombreUsuario() }}</a>
      </div>
      <button class="btn-logout" (click)="logout()">Salir</button>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex; align-items: center; gap: 1.5rem;
      background: #1b5e20; color: white;
      padding: 0 1.5rem; height: 60px;
      position: sticky; top: 0; z-index: 100;
      box-shadow: 0 2px 12px rgba(0,0,0,.3);
    }
    .nav-brand {
      font-size: 1.2rem; font-weight: 800; cursor: pointer;
      letter-spacing: -.5px; margin-right: auto;
    }
    .nav-links { display: flex; gap: 0.25rem; }
    .nav-links a {
      color: rgba(255,255,255,.8); text-decoration: none;
      padding: 0.4rem 0.9rem; border-radius: 8px;
      font-size: 0.9rem; transition: all .2s;
      display: flex; align-items: center; gap: 0.4rem;
    }
    .nav-links a:hover, .nav-links a.active {
      background: rgba(255,255,255,.15); color: white;
    }
    .nav-carrito { position: relative; }
    .badge {
      background: #ff6f00; color: white;
      border-radius: 50%; width: 18px; height: 18px;
      font-size: 0.7rem; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
    }
    .btn-logout {
      background: rgba(255,255,255,.15); color: white;
      border: 1px solid rgba(255,255,255,.3);
      padding: 0.35rem 0.9rem; border-radius: 8px;
      cursor: pointer; font-size: 0.85rem; transition: .2s;
    }
    .btn-logout:hover { background: rgba(255,255,255,.3); }
  `]
})
export class NavbarComponent {
  constructor(
    public tiendaService: TiendaService,
    private msalService: MsalService
  ) {}

  logout(): void {
    this.msalService.instance.logoutRedirect();
  }
}
