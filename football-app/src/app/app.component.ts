// Importaciones de Angular
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Importamos los componentes de cabecera y pie de página
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',     // Etiqueta raíz definida en index.html
  standalone: true,
  imports: [
    RouterOutlet,           // Muestra el componente según la ruta activa
    HeaderComponent,        // Cabecera con navbar
    FooterComponent         // Pie de página
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'FutResult';
}
