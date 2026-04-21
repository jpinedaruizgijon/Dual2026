// Importaciones necesarias de Angular
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',    // Etiqueta HTML que representa este componente
  standalone: true,          // Componente independiente (Angular 17+)
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  // Año actual para mostrarlo dinámicamente en el pie de página
  currentYear: number = new Date().getFullYear();
}
