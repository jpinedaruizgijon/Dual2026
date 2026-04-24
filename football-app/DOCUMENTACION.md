# FutResult — Documentación técnica del proyecto

## Índice

1. [Visión general](#1-visión-general)
2. [Tecnologías utilizadas](#2-tecnologías-utilizadas)
3. [Estructura de carpetas](#3-estructura-de-carpetas)
4. [Cómo arranca Angular](#4-cómo-arranca-angular)
5. [Configuración global — app.config.ts](#5-configuración-global--appconfigts)
6. [Rutas — app.routes.ts](#6-rutas--approutests)
7. [Estilos — Bootstrap personalizado con Sass](#7-estilos--bootstrap-personalizado-con-sass)
8. [Componentes compartidos: Header y Footer](#8-componentes-compartidos-header-y-footer)
9. [Página de Inicio](#9-página-de-inicio)
10. [Página de Resultados — API externa](#10-página-de-resultados--api-externa)
11. [El interceptor HTTP](#11-el-interceptor-http)
12. [El proxy de desarrollo (solución CORS)](#12-el-proxy-de-desarrollo-solución-cors)
13. [Página de Favoritos — CRUD](#13-página-de-favoritos--crud)
14. [Página de Estadísticas — Gráficos](#14-página-de-estadísticas--gráficos)
15. [Variables de entorno](#15-variables-de-entorno)
16. [El modelo de datos Favorito](#16-el-modelo-de-datos-favorito)
17. [PENDIENTE: Backend Laravel](#17-pendiente-backend-laravel)
18. [PENDIENTE: Despliegue en producción](#18-pendiente-despliegue-en-producción)
19. [Flujo completo de una petición](#19-flujo-completo-de-una-petición)

---

## 1. Visión general

FutResult es una aplicación **SPA (Single Page Application)** hecha en Angular 19. Esto significa que el navegador solo carga una página HTML (`index.html`) y Angular se encarga de mostrar y ocultar componentes según la URL, sin recargar la página en ningún momento.

La aplicación tiene dos fuentes de datos:

- **API externa** — `football-data.org`: proporciona resultados de partidos, equipos y ligas de fútbol real.
- **API propia** — Backend en Laravel (aún por implementar): gestiona la lista personal de equipos favoritos del usuario, con operaciones CRUD completas.

---

## 2. Tecnologías utilizadas

| Tecnología | Versión | Para qué se usa |
|---|---|---|
| Angular | 19 | Framework principal del frontend |
| TypeScript | 5.x | Lenguaje base de Angular (JavaScript tipado) |
| Bootstrap | 5.3 | Framework CSS de componentes visuales |
| Sass (SCSS) | — | Preprocesador CSS para personalizar Bootstrap |
| Chart.js + ng2-charts | 4.x / 10.x | Librería de gráficos interactivos |
| football-data.org | v4 | API externa de resultados de fútbol |
| Laravel | (pendiente) | Backend con API REST propia |

---

## 3. Estructura de carpetas

```
football-app/
├── src/
│   ├── index.html                  ← HTML base (solo tiene <app-root>)
│   ├── main.ts                     ← Punto de entrada de Angular
│   ├── styles.scss                 ← Estilos globales + Bootstrap personalizado
│   ├── environments/
│   │   ├── environment.ts          ← Variables para desarrollo (proxy, API key)
│   │   └── environment.prod.ts     ← Variables para producción (URL real)
│   └── app/
│       ├── app.component.ts/html   ← Componente raíz (layout: header + outlet + footer)
│       ├── app.config.ts           ← Configuración global (HttpClient, Router, Charts)
│       ├── app.routes.ts           ← Definición de todas las rutas
│       ├── components/
│       │   ├── header/             ← Barra de navegación (navbar)
│       │   └── footer/             ← Pie de página
│       ├── pages/
│       │   ├── inicio/             ← Página de bienvenida
│       │   ├── resultados/         ← Resultados de partidos (API externa)
│       │   ├── favoritos/          ← CRUD de favoritos (API propia)
│       │   └── estadisticas/       ← Gráficos (Chart.js)
│       ├── services/
│       │   ├── football.service.ts ← Llamadas a la API externa
│       │   └── favoritos.service.ts← Llamadas a la API propia (CRUD)
│       ├── interceptors/
│       │   └── football.interceptor.ts ← Añade el token a las peticiones
│       └── models/
│           └── favorito.model.ts   ← Interfaz TypeScript del objeto Favorito
├── proxy.conf.json                 ← Configuración del proxy anti-CORS (solo desarrollo)
└── angular.json                    ← Configuración del proyecto Angular CLI
```

---

## 4. Cómo arranca Angular

El proceso de arranque sigue estos pasos en orden:

### Paso 1 — El navegador carga `index.html`

```html
<body>
  <app-root></app-root>
</body>
```

`index.html` no tiene casi nada. Solo contiene la etiqueta `<app-root>`, que es el punto donde Angular insertará toda la aplicación.

### Paso 2 — Se ejecuta `main.ts`

```typescript
bootstrapApplication(AppComponent, appConfig)
```

`main.ts` es el fichero que el navegador ejecuta primero. Le dice a Angular: _"arranca la aplicación usando `AppComponent` como componente raíz, con la configuración de `appConfig`"_.

### Paso 3 — Angular monta `AppComponent`

`AppComponent` es el esqueleto de la página. Su plantilla (`app.component.html`) tiene esta estructura fija:

```html
<div class="app-wrapper">
  <app-header></app-header>    <!-- Navbar siempre visible -->
  <main class="main-content">
    <router-outlet></router-outlet>  <!-- Aquí cambia el contenido -->
  </main>
  <app-footer></app-footer>    <!-- Footer siempre visible -->
</div>
```

El `<router-outlet>` es el hueco donde Angular renderiza el componente de la página activa según la URL. El header y el footer nunca se desmontan.

---

## 5. Configuración global — `app.config.ts`

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([footballInterceptor])),
    provideCharts(withDefaultRegisterables())
  ]
};
```

Este fichero registra los servicios globales que estarán disponibles en toda la app:

- **`provideRouter(routes)`** — Activa el sistema de rutas con la tabla definida en `app.routes.ts`.
- **`provideHttpClient(withInterceptors(...))`** — Habilita el servicio `HttpClient` para hacer peticiones HTTP, y le enchufamos nuestro interceptor.
- **`provideCharts(...)`** — Registra Chart.js con todos sus tipos de gráficos (barras, tarta, línea...).

---

## 6. Rutas — `app.routes.ts`

```typescript
export const routes: Routes = [
  { path: '',            redirectTo: 'inicio',      pathMatch: 'full' },
  { path: 'inicio',      component: InicioComponent },
  { path: 'resultados',  component: ResultadosComponent },
  { path: 'favoritos',   component: FavoritosComponent },
  { path: 'estadisticas',component: EstadisticasComponent },
  { path: '**',          redirectTo: 'inicio' }
];
```

Cada objeto de la tabla relaciona una **URL** con un **componente**. Cuando el usuario navega a `/resultados`, Angular destruye el componente anterior del `<router-outlet>` y monta `ResultadosComponent` en su lugar, sin recargar la página.

- `path: ''` con `pathMatch: 'full'` — Solo coincide si la URL es exactamente `/`. Redirige al inicio.
- `path: '**'` — Comodín: cualquier URL que no exista redirige al inicio (equivale a una página 404 suave).

Los enlaces del navbar usan `routerLink` en vez de `href` para aprovechar este sistema:

```html
<a routerLink="/resultados" routerLinkActive="active">Resultados</a>
```

`routerLinkActive="active"` añade automáticamente la clase CSS `active` al enlace de la página actual.

---

## 7. Estilos — Bootstrap personalizado con Sass

En lugar de importar Bootstrap ya compilado (el CSS genérico), importamos su **código fuente Sass** y le pasamos nuestras variables antes de que se compile:

```scss
// styles.scss
$color-primary: #1a6b3c;  // verde oscuro fútbol

@use 'bootstrap/scss/bootstrap' with (
  $primary:   #1a6b3c,   // sobreescribe el azul por defecto de Bootstrap
  $secondary: #f5a623,   // naranja/dorado
  $dark:      #0d1117,
  $light:     #f8f9fa
);
```

Con la sintaxis `@use ... with (...)` de Dart Sass, Bootstrap recibe nuestros valores **antes** de compilar sus propios ficheros. El resultado es que `btn-primary`, `bg-primary`, `navbar-dark bg-primary` y cualquier clase de Bootstrap usa automáticamente nuestro verde, sin tocar ningún CSS manualmente.

---

## 8. Componentes compartidos: Header y Footer

### Header (`components/header/`)

El header es un componente standalone que contiene la navbar de Bootstrap. Usa `RouterLink` y `RouterLinkActive` para la navegación:

```html
<nav class="navbar navbar-expand-lg navbar-dark bg-primary">
  <a class="navbar-brand" routerLink="/">⚽ FutResult</a>
  ...
  <a class="nav-link" routerLink="/resultados" routerLinkActive="active">
    Resultados
  </a>
  ...
</nav>
```

El botón hamburguesa para móviles funciona gracias a `data-bs-toggle="collapse"` de Bootstrap JS, que está registrado en `angular.json` como script global.

### Footer (`components/footer/`)

El footer muestra el año actual calculado en TypeScript para que nunca quede desactualizado:

```typescript
// footer.component.ts
currentYear: number = new Date().getFullYear();
```

```html
<!-- footer.component.html -->
<small>© {{ currentYear }} FutResult</small>
```

`{{ currentYear }}` es **interpolación de Angular**: lee la propiedad del componente y la inserta en el HTML. Si la propiedad cambia, el HTML se actualiza automáticamente.

---

## 9. Página de Inicio

`InicioComponent` es una página puramente visual. No hace peticiones HTTP. Tiene un array de objetos en TypeScript que representa las tarjetas de características:

```typescript
features = [
  { icono: '🏆', titulo: 'Resultados en directo', ruta: '/resultados', ... },
  { icono: '⭐', titulo: 'Tus favoritos',          ruta: '/favoritos',  ... },
  { icono: '📊', titulo: 'Estadísticas',            ruta: '/estadisticas',...},
];
```

En la plantilla se recorre con `*ngFor`:

```html
<div *ngFor="let feature of features">
  <a [routerLink]="feature.ruta">{{ feature.boton }}</a>
</div>
```

`*ngFor` es una **directiva estructural** de Angular: repite el elemento HTML tantas veces como elementos tenga el array, creando una tarjeta por cada objeto.

---

## 10. Página de Resultados — API externa

Esta es la página más compleja del frontend. Su funcionamiento es:

### Flujo de datos

```
Usuario selecciona liga
      ↓
cargarPartidos() en ResultadosComponent
      ↓
FootballService.getMatchesByCompetition('PD')
      ↓
HttpClient → GET /api-football/competitions/PD/matches?status=FINISHED
      ↓  (el proxy redirige a football-data.org)
      ↓  (el interceptor añade X-Auth-Token)
Respuesta JSON con array de partidos
      ↓
this.matches = data.matches
this.filteredMatches = this.matches
      ↓
*ngFor renderiza una tarjeta por partido
```

### Búsqueda en tiempo real (sin petición HTTP)

Cuando el usuario escribe en el buscador, se llama a `filtrar()`:

```typescript
filtrar(): void {
  const texto = this.searchText.toLowerCase().trim();
  this.filteredMatches = this.matches.filter(match =>
    match.homeTeam.name.toLowerCase().includes(texto) ||
    match.awayTeam.name.toLowerCase().includes(texto)
  );
}
```

La clave es que se filtra sobre `this.matches` (todos los datos ya descargados) y el resultado va a `this.filteredMatches` (lo que se muestra). Así no se hace ninguna petición adicional a la API.

### Estados visuales

El componente maneja tres estados con variables booleanas:

```typescript
loading: boolean = false;      // Muestra el spinner
errorMessage: string = '';     // Muestra el alert de error
filteredMatches: any[] = [];   // Si está vacío, aviso de sin resultados
```

En la plantilla, `*ngIf` muestra u oculta cada sección según el estado:

```html
<div *ngIf="loading"> ... spinner ... </div>
<div *ngIf="errorMessage"> ... error ... </div>
<div *ngIf="filteredMatches.length > 0"> ... tarjetas ... </div>
```

---

## 11. El interceptor HTTP

Un interceptor es un middleware para peticiones HTTP. Se ejecuta automáticamente cada vez que el código hace una petición, antes de que salga al servidor.

```typescript
// football.interceptor.ts
export const footballInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith(environment.footballApiUrl)) {
    const reqConToken = req.clone({
      setHeaders: { 'X-Auth-Token': environment.footballApiKey }
    });
    return next(reqConToken);
  }
  return next(req);
};
```

**Por qué `req.clone()`?** Las peticiones HTTP en Angular son inmutables (no se pueden modificar directamente). Para añadir cabeceras hay que crear una copia modificada con `clone()` y enviar esa copia.

**Por qué comprobamos la URL?** El interceptor se ejecuta para TODAS las peticiones HTTP, incluyendo las que van al backend Laravel. No queremos enviar el token de football-data.org a nuestro propio servidor, así que solo lo añadimos si la URL empieza por la URL de la API de fútbol.

---

## 12. El proxy de desarrollo (solución CORS)

**El problema:** Los navegadores bloquean por seguridad las peticiones a dominios distintos del que sirve la página web (política CORS). `football-data.org` no permite peticiones directas desde el navegador.

**La solución:** El servidor de desarrollo de Angular actúa como intermediario. Cuando Angular hace una petición a `/api-football/...`, el servidor de desarrollo la recibe y la reenvía a `https://api.football-data.org/v4/...`. El navegador solo ve `localhost`, no el dominio externo.

```json
// proxy.conf.json
{
  "/api-football": {
    "target": "https://api.football-data.org/v4",
    "changeOrigin": true,
    "pathRewrite": { "^/api-football": "" }
  }
}
```

**`pathRewrite`** elimina el prefijo `/api-football` antes de reenviar. Así `/api-football/competitions/PD/matches` se convierte en `https://api.football-data.org/v4/competitions/PD/matches`.

**Importante:** Este proxy solo funciona con `ng serve` (desarrollo). En producción, la URL del entorno apunta directamente a `https://api.football-data.org/v4` y el CORS se configura en el servidor de producción.

---

## 13. Página de Favoritos — CRUD

### Cómo funciona el Two-Way Binding del formulario

`[(ngModel)]` sincroniza el valor del campo HTML con la propiedad del componente en los dos sentidos: si el usuario escribe en el input, la propiedad se actualiza; si la propiedad cambia en el código, el input se actualiza.

```html
<input [(ngModel)]="formulario.equipo" name="equipo">
```

```typescript
formulario: Favorito = { equipo: '', liga: '', pais: '', nota: '' };
```

### Modo creación vs modo edición

El mismo formulario sirve para crear y editar, controlado por `editando: boolean`:

```typescript
// Cuando se pulsa "Editar" en la tabla:
editar(favorito: Favorito): void {
  this.formulario = { ...favorito };  // copia del objeto (spread operator)
  this.editando = true;
}

// Cuando se envía el formulario:
guardar(): void {
  if (this.editando && this.formulario.id) {
    this.favoritosService.update(this.formulario.id, this.formulario).subscribe(...)
  } else {
    this.favoritosService.create(this.formulario).subscribe(...)
  }
}
```

`{ ...favorito }` es el operador spread de JavaScript. Crea una copia independiente del objeto, de modo que si el usuario cambia los campos del formulario no modifica directamente el objeto de la lista mientras edita.

### Los cinco métodos del FavoritosService

```typescript
getAll()              → GET    /api/favoritos
getById(id)           → GET    /api/favoritos/{id}
create(favorito)      → POST   /api/favoritos
update(id, favorito)  → PUT    /api/favoritos/{id}
delete(id)            → DELETE /api/favoritos/{id}
```

Todos devuelven un `Observable`. Un Observable es como una "promesa con esteroides": representa un valor que llegará en el futuro. Se activa con `.subscribe()`:

```typescript
this.favoritosService.getAll().subscribe({
  next: (data) => { /* se ejecuta si la petición tiene éxito */ },
  error: (err) => { /* se ejecuta si hay un error */ }
});
```

---

## 14. Página de Estadísticas — Gráficos

### Cómo funciona ng2-charts con Chart.js

`ng2-charts` es un wrapper de Angular para Chart.js. En lugar de manipular el canvas directamente, definimos los datos y opciones como propiedades de TypeScript y los enlazamos a la directiva `baseChart`:

```html
<canvas
  baseChart
  [data]="barChartData"
  [options]="barChartOptions"
  [type]="barChartType">
</canvas>
```

Cuando `barChartData` cambia en TypeScript, el gráfico se redibuja automáticamente.

### Procesamiento de datos para los gráficos

Toda la lógica está en `procesarDatosGraficos()`. Recibe el array de partidos de la API y hace dos cosas en una sola pasada:

**Para el gráfico de barras** — acumula goles por equipo en un mapa:
```typescript
const golesMap: { [equipo: string]: { local: number; visitante: number } } = {};

partidos.forEach(match => {
  golesMap[match.homeTeam.name].local += match.score.fullTime.home;
  golesMap[match.awayTeam.name].visitante += match.score.fullTime.away;
});
```

**Para el gráfico de tarta** — cuenta resultados:
```typescript
if (golesLocal > golesVisitante)       victoriasLocal++;
else if (golesLocal === golesVisitante) empates++;
else                                   victoriasVisitante++;
```

Luego solo se muestran los 10 equipos con más goles como local para no saturar el gráfico:
```typescript
const equipos = Object.keys(golesMap)
  .sort((a, b) => golesMap[b].local - golesMap[a].local)
  .slice(0, 10);
```

---

## 15. Variables de entorno

Angular tiene dos ficheros de entorno:

```typescript
// environment.ts (DESARROLLO)
export const environment = {
  production: false,
  footballApiUrl: '/api-football',   // apunta al proxy local
  footballApiKey: 'tu_api_key',
  apiUrl: 'http://localhost:8000/api' // backend Laravel local
};

// environment.prod.ts (PRODUCCIÓN)
export const environment = {
  production: true,
  footballApiUrl: 'https://api.football-data.org/v4', // URL directa
  footballApiKey: 'tu_api_key',
  apiUrl: 'https://tudominio.com/api'  // backend Laravel en producción
};
```

Al compilar con `ng build --configuration=production`, Angular sustituye automáticamente `environment.ts` por `environment.prod.ts` en todos los ficheros que lo importan. El resto del código no cambia nada.

---

## 16. El modelo de datos Favorito

```typescript
// models/favorito.model.ts
export interface Favorito {
  id?:     number;  // ? = opcional (no existe en creación)
  equipo:  string;
  liga:    string;
  pais:    string;
  nota:    string;
}
```

Una `interface` en TypeScript es un contrato: define la forma que debe tener un objeto. No genera código JavaScript, solo sirve para que TypeScript detecte errores si usamos mal los datos (por ejemplo, si intentamos acceder a `favorito.nombre` cuando el campo se llama `equipo`).

---

## 17. PENDIENTE: Backend Laravel

El backend en Laravel es una API REST que expone los endpoints que consume `FavoritosService`. Estos son los pasos para crearlo:

### Instalación

```bash
composer create-project laravel/laravel futresult-api
cd futresult-api
```

### Migración de base de datos

```php
// database/migrations/xxxx_create_favoritos_table.php
Schema::create('favoritos', function (Blueprint $table) {
    $table->id();
    $table->string('equipo');
    $table->string('liga');
    $table->string('pais');
    $table->string('nota')->nullable();
    $table->timestamps();
});
```

```bash
php artisan migrate
```

### Modelo Eloquent

```php
// app/Models/Favorito.php
class Favorito extends Model {
    protected $fillable = ['equipo', 'liga', 'pais', 'nota'];
}
```

`$fillable` indica qué campos se pueden asignar masivamente (protección contra ataques de asignación masiva).

### Controlador con todos los métodos CRUD

```php
// app/Http/Controllers/FavoritoController.php
class FavoritoController extends Controller {

    public function index() {
        return Favorito::all();                   // GET /favoritos
    }

    public function show($id) {
        return Favorito::findOrFail($id);         // GET /favoritos/{id}
    }

    public function store(Request $request) {
        $favorito = Favorito::create($request->all());
        return response()->json($favorito, 201);  // POST /favoritos
    }

    public function update(Request $request, $id) {
        $favorito = Favorito::findOrFail($id);
        $favorito->update($request->all());
        return $favorito;                         // PUT /favoritos/{id}
    }

    public function destroy($id) {
        Favorito::findOrFail($id)->delete();
        return response()->json(null, 204);       // DELETE /favoritos/{id}
    }
}
```

### Rutas de la API

```php
// routes/api.php
Route::apiResource('favoritos', FavoritoController::class);
```

`apiResource` registra automáticamente los 5 endpoints estándar (index, show, store, update, destroy).

### CORS en Laravel

Para que Angular pueda llamar al backend desde otro dominio/puerto, hay que habilitar CORS en `config/cors.php`:

```php
'allowed_origins' => ['http://localhost:4200'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
```

### Arrancar el backend

```bash
php artisan serve --port=8000
```

Con esto, `FavoritosService` en Angular ya puede hablar con el backend, ya que `apiUrl` en `environment.ts` apunta a `http://localhost:8000/api`.

---

## 18. PENDIENTE: Despliegue en producción

### Frontend Angular en Ruix

```bash
# Compilar para producción (minifica el código, usa environment.prod.ts)
ng build --configuration=production

# El resultado está en dist/football-app/
# Subir ese contenido al servidor Ruix por FTP o SSH
```

En el servidor Ruix hay que configurar el servidor web (Apache/Nginx) para que todas las rutas apunten al `index.html`, ya que Angular gestiona la navegación en el cliente:

```apache
# .htaccess para Apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### Backend Laravel en Ruix

```bash
# Subir el proyecto Laravel al servidor
# Configurar .env con los datos de la base de datos del servidor
# Ejecutar migraciones en el servidor
php artisan migrate --force
```

---

## 19. Flujo completo de una petición

Para entender cómo encajan todas las piezas, aquí está el recorrido completo de una petición de resultados:

```
1. Usuario abre /resultados en el navegador
       ↓
2. Angular Router detecta la ruta y monta ResultadosComponent
       ↓
3. ngOnInit() se ejecuta automáticamente
       ↓
4. Llama a cargarPartidos()
       ↓
5. FootballService.getMatchesByCompetition('PD') construye la URL:
   /api-football/competitions/PD/matches?status=FINISHED
       ↓
6. HttpClient prepara la petición GET
       ↓
7. footballInterceptor intercepta la petición:
   - La URL empieza por /api-football (que es environment.footballApiUrl)
   - Clona la petición añadiendo la cabecera X-Auth-Token
       ↓
8. La petición sale al servidor de desarrollo de Angular (ng serve)
       ↓
9. proxy.conf.json detecta que la URL empieza por /api-football:
   - Reescribe la URL: elimina /api-football
   - Redirige a https://api.football-data.org/v4/competitions/PD/matches?status=FINISHED
   - Reenvía la cabecera X-Auth-Token
       ↓
10. football-data.org responde con JSON (array de partidos)
       ↓
11. La respuesta llega al Observable en el subscribe():
    next: (data) => { this.matches = data.matches; ... }
       ↓
12. Angular detecta el cambio en matches/filteredMatches
       ↓
13. *ngFor re-renderiza las tarjetas de partidos en el DOM
       ↓
14. El usuario ve los partidos en pantalla
```
