import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'catalogo', pathMatch: 'full' },
  {
    path: 'catalogo',
    loadComponent: () => import('./components/catalogo/catalogo.component').then(m => m.CatalogoComponent)
  },
  {
    path: 'producto/:id',
    loadComponent: () => import('./components/producto-detalle/producto-detalle.component').then(m => m.ProductoDetalleComponent)
  },
  {
    path: 'carrito',
    loadComponent: () => import('./components/carrito/carrito.component').then(m => m.CarritoComponent)
  },
  {
    path: 'perfil',
    loadComponent: () => import('./components/perfil/perfil.component').then(m => m.PerfilComponent)
  },
  { path: '**', redirectTo: 'catalogo' }
];
