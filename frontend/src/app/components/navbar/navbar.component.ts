import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { TiendaService } from '../../services/tienda.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html', // <--- Cambiado a Url para que lea tu archivo html externo
  styles: [`
    /* Base del Navbar */
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #1b5e20;
      padding: 0 2rem;
      height: 65px;
      color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      box-shadow: 0 2px 12px rgba(0,0,0,.3);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    /* Marca / Logo */
    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.2rem;
      font-weight: 800;
      cursor: pointer;
      letter-spacing: -.5px;
      text-decoration: none;
      color: white;
    }

    .brand-icon {
      color: #81c784;
    }

    /* Contenedor derecho de acciones */
    .navbar-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    /* Enlaces de navegación */
    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      color: rgba(255,255,255,.8);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      padding: 0.4rem 0.9rem;
      border-radius: 8px;
      transition: all .2s;
      position: relative;
    }

    .nav-link:hover, .nav-link.active {
      background: rgba(255,255,255,.15);
      color: white;
    }

    /* Badge flotante del Carrito */
    .badge {
      background: #ff6f00;
      color: white;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      font-size: 0.7rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: -2px;
      right: -2px;
    }

    /* Separador Vertical */
    .vertical-divider {
      width: 1px;
      height: 20px;
      background-color: rgba(255, 255, 255, 0.2);
      margin: 0 0.5rem;
    }

    /* Contenedor de Usuario y Perfil */
    .navbar-user {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    /* Botón Salir */
    .btn-logout {
      background: rgba(255,255,255,.11);
      color: white;
      border: 1px solid rgba(255,255,255,.3);
      padding: 0.35rem 0.9rem;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.85rem;
      transition: all .2s;
    }

    .btn-logout:hover {
      background: #d32f2f;
      border-color: #d32f2f;
    }
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