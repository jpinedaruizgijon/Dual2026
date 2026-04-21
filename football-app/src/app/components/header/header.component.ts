// Importaciones necesarias de Angular
import { Component } from '@angular/core';
// RouterLink y RouterLinkActive permiten usar routerLink y routerLinkActive en la plantilla
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',       // Etiqueta HTML que representa este componente
  standalone: true,             // Componente independiente (Angular 17+)
  imports: [RouterLink, RouterLinkActive], // Módulos necesarios para la navegación
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  // Por ahora no necesita lógica, solo muestra la navbar
}
