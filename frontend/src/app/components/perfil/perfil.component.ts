import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { TiendaService } from '../../services/tienda.service';
import { Perfil } from '../../models/tienda.models';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  perfil: Perfil = { nombre: '', email: '', telefono: '', direccion: '' };
  editando = false;
  guardado = false;
  perfilOriginal: Perfil = { nombre: '', email: '', telefono: '', direccion: '' };

  constructor(public tiendaService: TiendaService) {}

  ngOnInit(): void {
    this.perfil = this.tiendaService.getPerfil();
    this.perfilOriginal = { ...this.perfil };
  }

  editar(): void {
    this.perfilOriginal = { ...this.perfil };
    this.editando = true;
  }

  cancelar(): void {
    this.perfil = { ...this.perfilOriginal };
    this.editando = false;
  }

  guardar(): void {
    this.tiendaService.guardarPerfil(this.perfil);
    this.editando = false;
    this.guardado = true;
    setTimeout(() => this.guardado = false, 3000);
  }

  get iniciales(): string {
    return this.perfil.nombre
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || '??';
  }
}
