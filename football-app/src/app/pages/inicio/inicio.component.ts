import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
// Title service de Angular: permite cambiar el título de la pestaña del navegador
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent implements OnInit {

  constructor(private title: Title) {}

  ngOnInit(): void {
    this.title.setTitle('FutResult — Inicio');
  }
  // Las tarjetas de características que se muestran en la página de inicio
  features = [
    {
      icono: '🏆',
      titulo: 'Resultados en directo',
      descripcion: 'Consulta los resultados y marcadores de las principales ligas europeas.',
      ruta: '/resultados',
      boton: 'Ver resultados'
    },
    {
      icono: '⭐',
      titulo: 'Tus favoritos',
      descripcion: 'Guarda y gestiona tus equipos favoritos con tu lista personalizada.',
      ruta: '/favoritos',
      boton: 'Gestionar favoritos'
    },
    {
      icono: '📊',
      titulo: 'Estadísticas',
      descripcion: 'Visualiza gráficos de goles y distribución de resultados por liga.',
      ruta: '/estadisticas',
      boton: 'Ver estadísticas'
    }
  ];
}
