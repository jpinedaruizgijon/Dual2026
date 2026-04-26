// Importaciones de Angular
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Importamos los componentes de cabecera, pie de página y migas de pan
import { HeaderComponent }     from './components/header/header.component';
import { FooterComponent }     from './components/footer/footer.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-root',     // Etiqueta raíz definida en index.html
  standalone: true,
  imports: [
    RouterOutlet,           // Muestra el componente según la ruta activa
    HeaderComponent,        // Cabecera con navbar
    FooterComponent,        // Pie de página
    BreadcrumbComponent     // Migas de pan (usabilidad: orientación contextual)
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'FutResult';
}
