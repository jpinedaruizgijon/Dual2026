# 📚 BiblioLaravel — Aplicación de Alquiler de Libros
### Proyecto CRUD desarrollado con Laravel

---

## 1. Descripción de la Aplicación

**BiblioLaravel** es una aplicación web desarrollada con el framework **Laravel** que permite gestionar un sistema de alquiler de libros. Los usuarios pueden explorar el catálogo, consultar la disponibilidad en tiempo real y ver detalles completos de cada libro (autor, género, año, sinopsis, precio por día, etc.).

### Funcionalidades principales

- Ver libros disponibles
- Ver detalles de los libros
- Crear, editar y eliminar libros del catálogo
- Cambiar el estado de disponibilidad de un libro automáticamente al alquilarlo o devolverlo
- Paginación del listado de libros
- Validación de formularios en servidor

### Tablas de la base de datos

| Tabla | Descripción |
|---|---|
| `libros` | Catálogo de libros con todos sus atributos |
| `alquileres` | Registro de cada alquiler (libro, cliente, fechas) |

---

## 2. Estructura del Proyecto

```
bibliolaravel/
├── routes/
│   └── web.php                        ← Todas las rutas nombradas
├── app/
│   ├── Http/Controllers/
│   │   ├── LibroController.php        ← CRUD de libros
│   │   └── AlquilerController.php     ← Gestión de alquileres
│   └── Models/
│       ├── Libro.php
│       └── Alquiler.php
├── resources/views/
│   ├── layouts/
│   │   └── plantilla.blade.php        ← Plantilla base (Blade)
│   ├── libros/
│   │   ├── index.blade.php
│   │   ├── show.blade.php
│   │   ├── create.blade.php
│   │   └── edit.blade.php
│   └── alquileres/
│       ├── index.blade.php
│       └── create.blade.php
├── database/
│   ├── migrations/
│   │   ├── create_libros_table.php
│   │   └── create_alquileres_table.php
│   └── seeders/
│       └── DatabaseSeeder.php
└── public/
    └── css/
        └── estilos.css
```

---

## 3. Rutas — `routes/web.php`

Las rutas siguen estrictamente las convenciones REST de Laravel, con nombre en cada ruta para poder referenciarlas en vistas y redirecciones sin hardcodear URLs.

```php
<?php

use App\Http\Controllers\LibroController;
use App\Http\Controllers\AlquilerController;

// ─── LIBROS ────────────────────────────────────────────────────────────
Route::get('/libros',                  [LibroController::class, 'index'])
    ->name('libros.index');

Route::get('/libros/create',           [LibroController::class, 'create'])
    ->name('libros.create');

Route::post('/libros',                 [LibroController::class, 'store'])
    ->name('libros.store');

Route::get('/libros/{libro}',          [LibroController::class, 'show'])
    ->name('libros.show');

Route::get('/libros/{libro}/edit',     [LibroController::class, 'edit'])
    ->name('libros.edit');

Route::put('/libros/{libro}',          [LibroController::class, 'update'])
    ->name('libros.update');

Route::delete('/libros/{libro}',       [LibroController::class, 'destroy'])
    ->name('libros.destroy');

// ─── ALQUILERES ─────────────────────────────────────────────────────────
Route::get('/alquileres',              [AlquilerController::class, 'index'])
    ->name('alquileres.index');

Route::get('/alquileres/create/{libro}', [AlquilerController::class, 'create'])
    ->name('alquileres.create');

Route::post('/alquileres',             [AlquilerController::class, 'store'])
    ->name('alquileres.store');

Route::delete('/alquileres/{alquiler}',[AlquilerController::class, 'destroy'])
    ->name('alquileres.destroy');

// Redirección raíz
Route::redirect('/', '/libros');
```

> **Nota:** El uso de `->name()` en cada ruta permite usar `route('libros.show', $libro)` en vistas y controladores, de forma que si la URL cambia, solo hay que tocar `web.php`.

---

## 4. Migraciones — `database/migrations/`

### Migración: Libros

```php
// create_libros_table.php
public function up(): void
{
    Schema::create('libros', function (Blueprint $table) {
        $table->id();
        $table->string('titulo');
        $table->string('autor');
        $table->string('isbn', 20)->unique();
        $table->string('genero');
        $table->year('anio_publicacion');
        $table->text('sinopsis')->nullable();
        $table->decimal('precio_dia', 5, 2);         // precio de alquiler por día
        $table->boolean('disponible')->default(true); // disponibilidad en tiempo real
        $table->string('portada')->nullable();         // ruta de imagen
        $table->timestamps();
    });
}
```

### Migración: Alquileres

```php
// create_alquileres_table.php
public function up(): void
{
    Schema::create('alquileres', function (Blueprint $table) {
        $table->id();
        $table->string('nombre_cliente');
        $table->string('email_cliente');
        $table->date('fecha_inicio');
        $table->date('fecha_fin');
        $table->timestamps();

        // Clave foránea hacia libros
        $table->foreignId('libro_id')->constrained('libros');
    });
}
```

> La clave foránea `libro_id` enlaza cada alquiler con su libro correspondiente, garantizando integridad referencial a nivel de base de datos.

---

## 5. Modelos — `app/Models/`

### Modelo Libro

```php
// app/Models/Libro.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Libro extends Model
{
    // Permite asignación masiva de todos los campos del formulario
    protected $guarded = [];

    // Relación: un libro puede tener muchos alquileres
    public function alquileres()
    {
        return $this->hasMany(Alquiler::class);
    }
}
```

### Modelo Alquiler

```php
// app/Models/Alquiler.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Alquiler extends Model
{
    protected $guarded = [];

    // Relación inversa: un alquiler pertenece a un libro
    public function libro()
    {
        return $this->belongsTo(Libro::class);
    }
}
```

> Las relaciones `hasMany` / `belongsTo` permiten acceder a datos relacionados desde Blade con expresiones como `$alquiler->libro->titulo` sin escribir JOINs manuales.

---

## 6. Controladores

### LibroController — CRUD completo

```php
// app/Http/Controllers/LibroController.php
<?php

namespace App\Http\Controllers;

use App\Models\Libro;
use Illuminate\Http\Request;

class LibroController extends Controller
{
    // Listado paginado, con filtro opcional de disponibilidad
    public function index(Request $request)
    {
        $query = Libro::orderBy('titulo');

        if ($request->has('disponible')) {
            $query->where('disponible', true);
        }

        $libros = $query->paginate(8);
        return view('libros.index', compact('libros'));
    }

    // Detalle de un libro (Laravel resuelve el objeto automáticamente por ID)
    public function show(Libro $libro)
    {
        return view('libros.show', compact('libro'));
    }

    // Formulario de creación
    public function create()
    {
        return view('libros.create');
    }

    // Guardar nuevo libro con validación
    public function store(Request $request)
    {
        $request->validate([
            'titulo'           => 'required|max:255',
            'autor'            => 'required|max:255',
            'isbn'             => 'required|unique:libros,isbn|max:20',
            'genero'           => 'required',
            'anio_publicacion' => 'required|integer|min:1000|max:2100',
            'precio_dia'       => 'required|numeric|min:0',
        ]);

        Libro::create($request->all());
        return redirect()->route('libros.index');
    }

    // Formulario de edición
    public function edit(Libro $libro)
    {
        return view('libros.edit', compact('libro'));
    }

    // Actualizar libro
    public function update(Libro $libro, Request $request)
    {
        $request->validate([
            'titulo'           => 'required|max:255',
            'autor'            => 'required|max:255',
            'precio_dia'       => 'required|numeric|min:0',
        ]);

        $libro->update($request->all());
        return redirect()->route('libros.show', $libro);
    }

    // Eliminar libro
    public function destroy(Libro $libro)
    {
        $libro->delete();
        return redirect()->route('libros.index');
    }
}
```

### AlquilerController — Registrar y devolver alquileres

```php
// app/Http/Controllers/AlquilerController.php
<?php

namespace App\Http\Controllers;

use App\Models\Alquiler;
use App\Models\Libro;
use Illuminate\Http\Request;

class AlquilerController extends Controller
{
    // Listado de todos los alquileres activos
    public function index()
    {
        $alquileres = Alquiler::with('libro')->orderBy('fecha_inicio', 'desc')->get();
        return view('alquileres.index', compact('alquileres'));
    }

    // Formulario de nuevo alquiler, recibe el libro como parámetro de ruta
    public function create(Libro $libro)
    {
        return view('alquileres.create', compact('libro'));
    }

    // Registrar alquiler y marcar libro como no disponible
    public function store(Request $request)
    {
        $request->validate([
            'libro_id'       => 'required|exists:libros,id',
            'nombre_cliente' => 'required|max:255',
            'email_cliente'  => 'required|email',
            'fecha_inicio'   => 'required|date',
            'fecha_fin'      => 'required|date|after:fecha_inicio',
        ]);

        Alquiler::create($request->all());

        // Actualizar disponibilidad del libro con Eloquent ORM
        $libro = Libro::find($request->libro_id);
        $libro->disponible = false;
        $libro->save();

        return redirect()->route('alquileres.index');
    }

    // Devolver libro: eliminar alquiler y restaurar disponibilidad
    public function destroy(Alquiler $alquiler)
    {
        $libro = $alquiler->libro;   // acceso por relación Eloquent
        $alquiler->delete();

        $libro->disponible = true;
        $libro->save();

        return redirect()->route('alquileres.index');
    }
}
```

---

## 7. Vistas Blade

### Plantilla base — `layouts/plantilla.blade.php`

```blade
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>@yield('titulo', 'BiblioLaravel')</title>
    <link rel="stylesheet" href="{{ asset('css/estilos.css') }}">
</head>
<body>
    <header>
        <nav>
            <a href="{{ route('libros.index') }}"
               class="{{ request()->routeIs('libros*') ? 'activo' : '' }}">
               📚 Catálogo
            </a>
            <a href="{{ route('alquileres.index') }}"
               class="{{ request()->routeIs('alquileres*') ? 'activo' : '' }}">
               📋 Alquileres
            </a>
            <a href="{{ route('libros.create') }}">+ Añadir libro</a>
        </nav>
    </header>

    <main>
        @yield('contenido')
    </main>

    <footer>
        <p>BiblioLaravel © {{ date('Y') }}</p>
    </footer>
</body>
</html>
```

### Listado de libros — `libros/index.blade.php`

```blade
@extends('layouts.plantilla')

@section('titulo', 'Catálogo de libros')

@section('contenido')
    <h1>Catálogo de libros</h1>

    <a href="{{ route('libros.index', ['disponible' => 1]) }}">Solo disponibles</a>
    <a href="{{ route('libros.index') }}">Ver todos</a>

    @foreach ($libros as $libro)
        <div class="tarjeta-libro {{ $libro->disponible ? 'disponible' : 'no-disponible' }}">
            <h2>{{ $libro->titulo }}</h2>
            <p>{{ $libro->autor }} · {{ $libro->anio_publicacion }}</p>
            <p>
                @if ($libro->disponible)
                    ✅ Disponible — {{ $libro->precio_dia }}€/día
                @else
                    ❌ Alquilado
                @endif
            </p>
            <a href="{{ route('libros.show', $libro) }}">Ver detalles</a>
        </div>
    @endforeach

    {{-- Navegación de páginas generada automáticamente por Laravel --}}
    {{ $libros->links() }}
@endsection
```

### Detalle de libro — `libros/show.blade.php`

```blade
@extends('layouts.plantilla')

@section('titulo', $libro->titulo)

@section('contenido')
    <h1>{{ $libro->titulo }}</h1>
    <p><strong>Autor:</strong> {{ $libro->autor }}</p>
    <p><strong>ISBN:</strong> {{ $libro->isbn }}</p>
    <p><strong>Género:</strong> {{ $libro->genero }}</p>
    <p><strong>Año:</strong> {{ $libro->anio_publicacion }}</p>
    <p><strong>Sinopsis:</strong> {{ $libro->sinopsis }}</p>
    <p><strong>Precio/día:</strong> {{ $libro->precio_dia }}€</p>
    <p><strong>Estado:</strong>
        @if ($libro->disponible)
            ✅ Disponible
        @else
            ❌ No disponible
        @endif
    </p>

    {{-- Botón de alquilar solo si está disponible --}}
    @if ($libro->disponible)
        <a href="{{ route('alquileres.create', $libro) }}">Alquilar este libro</a>
    @endif

    <a href="{{ route('libros.edit', $libro) }}">Editar</a>

    {{-- Formulario de borrado usando método DELETE --}}
    <form action="{{ route('libros.destroy', $libro) }}" method="POST">
        @csrf
        @method('DELETE')
        <button type="submit">Eliminar</button>
    </form>
@endsection
```

### Formulario de creación — `libros/create.blade.php`

```blade
@extends('layouts.plantilla')

@section('titulo', 'Nuevo libro')

@section('contenido')
    <h1>Añadir nuevo libro</h1>

    <form action="{{ route('libros.store') }}" method="POST">
        @csrf

        <label>Título</label>
        <input type="text" name="titulo" value="{{ old('titulo') }}">
        @error('titulo') <span class="error">{{ $message }}</span> @enderror

        <label>Autor</label>
        <input type="text" name="autor" value="{{ old('autor') }}">
        @error('autor') <span class="error">{{ $message }}</span> @enderror

        <label>ISBN</label>
        <input type="text" name="isbn" value="{{ old('isbn') }}">
        @error('isbn') <span class="error">{{ $message }}</span> @enderror

        <label>Género</label>
        <input type="text" name="genero" value="{{ old('genero') }}">

        <label>Año de publicación</label>
        <input type="number" name="anio_publicacion" value="{{ old('anio_publicacion') }}">

        <label>Sinopsis</label>
        <textarea name="sinopsis">{{ old('sinopsis') }}</textarea>

        <label>Precio por día (€)</label>
        <input type="number" step="0.01" name="precio_dia" value="{{ old('precio_dia') }}">
        @error('precio_dia') <span class="error">{{ $message }}</span> @enderror

        <button type="submit">Guardar libro</button>
    </form>
@endsection
```

---

## 8. Generación de datos con Factory y Seeder

```php
// database/factories/LibroFactory.php
public function definition(): array
{
    return [
        'titulo'           => $this->faker->sentence(3),
        'autor'            => $this->faker->name(),
        'isbn'             => $this->faker->unique()->isbn13(),
        'genero'           => $this->faker->randomElement([
                                'Novela', 'Ciencia Ficción', 'Historia',
                                'Thriller', 'Poesía', 'Ensayo'
                             ]),
        'anio_publicacion' => $this->faker->numberBetween(1950, 2024),
        'sinopsis'         => $this->faker->paragraph(),
        'precio_dia'       => $this->faker->randomFloat(2, 0.50, 5.00),
        'disponible'       => $this->faker->boolean(80), // 80% disponibles
    ];
}
```

```php
// database/seeders/DatabaseSeeder.php
use App\Models\Libro;

public function run(): void
{
    Libro::factory(50)->create(); // genera 50 libros de prueba
}
```

**Comando para poblar la base de datos:**
```bash
php artisan migrate:fresh --seed
```

---

## 9. Consultas Eloquent ORM destacadas

```php
// Listado paginado con filtro dinámico
$libros = Libro::orderBy('titulo')->where('disponible', true)->paginate(8);

// Alquileres con datos del libro relacionado (evita N+1 queries)
$alquileres = Alquiler::with('libro')->orderBy('fecha_inicio', 'desc')->get();

// Búsqueda por título o autor
$libros = Libro::where('titulo', 'like', '%'.$busqueda.'%')
               ->orWhere('autor', 'like', '%'.$busqueda.'%')
               ->paginate(8);

// Actualizar campo concreto sin formulario completo
$libro->disponible = false;
$libro->save();
```

---

## 10. Código No Visto en Clase

### 10.1 Carga ansiosa (`with`) para evitar el problema N+1

```php
// Sin with: ejecuta 1 query para alquileres + 1 por cada alquiler para su libro
$alquileres = Alquiler::all();

// Con with: solo 2 queries totales (mucho más eficiente)
$alquileres = Alquiler::with('libro')->get();
```

Cuando se accede a `$alquiler->libro->titulo` en el bucle Blade, Laravel ya tiene todos los libros cargados de una sola vez. Esto se llama **Eager Loading** y es una optimización fundamental cuando hay relaciones entre tablas.

### 10.2 Relaciones Eloquent entre modelos

```php
// En Libro.php — un libro tiene muchos alquileres
public function alquileres()
{
    return $this->hasMany(Alquiler::class);
}

// En Alquiler.php — un alquiler pertenece a un libro
public function libro()
{
    return $this->belongsTo(Libro::class);
}
```

Estas relaciones permiten navegar entre tablas como si fueran propiedades de objeto: `$alquiler->libro->titulo`, sin escribir ningún JOIN en SQL.

### 10.3 Filtro dinámico de rutas con parámetro opcional

```php
// En el controlador
public function index(Request $request)
{
    $query = Libro::orderBy('titulo');

    if ($request->has('disponible')) {
        $query->where('disponible', true);
    }

    $libros = $query->paginate(8);
    return view('libros.index', compact('libros'));
}
```

La ruta `/libros?disponible=1` activa automáticamente el filtro sin necesitar una ruta separada. Se usa `$request->has()` para detectar si el parámetro viene en la URL.

### 10.4 Actualización de estado entre tablas al registrar un alquiler

```php
// store() en AlquilerController
Alquiler::create($request->all());

$libro = Libro::find($request->libro_id);
$libro->disponible = false;
$libro->save();
```

Y al devolver el libro (destroy):

```php
$libro = $alquiler->libro;  // acceso por relación, no por query
$alquiler->delete();
$libro->disponible = true;
$libro->save();
```

Este patrón muestra cómo coordinar cambios en dos tablas desde un solo método del controlador, manteniendo la consistencia de los datos.

### 10.5 `@method('DELETE')` y `@method('PUT')` en formularios HTML

Los navegadores solo soportan `GET` y `POST` en formularios HTML. Laravel permite simular `PUT`, `PATCH` y `DELETE` añadiendo un campo oculto con la directiva Blade:

```blade
<form action="{{ route('libros.destroy', $libro) }}" method="POST">
    @csrf
    @method('DELETE')
    <button type="submit">Eliminar</button>
</form>
```

Blade genera automáticamente `<input type="hidden" name="_method" value="DELETE">` y Laravel lo intercepta para dirigirlo a la ruta correcta.

### 10.6 Navegación activa con `request()->routeIs()`

```blade
<a href="{{ route('libros.index') }}"
   class="{{ request()->routeIs('libros*') ? 'activo' : '' }}">
   Catálogo
</a>
```

El comodín `libros*` hace que el enlace aparezca como activo en cualquier ruta que empiece por `libros` (index, show, create, edit…), sin tener que comprobar cada ruta individualmente.

---

## 11. Comandos Artisan Utilizados

```bash
# Crear proyecto
laravel new bibliolaravel

# Controladores
php artisan make:controller LibroController
php artisan make:controller AlquilerController

# Modelos
php artisan make:model Libro
php artisan make:model Alquiler

# Migraciones
php artisan make:migration create_libros_table
php artisan make:migration create_alquileres_table

# Factories
php artisan make:factory LibroFactory --model=Libro

# Ejecutar migraciones y seeders
php artisan migrate
php artisan migrate:fresh --seed

# Servidor de desarrollo
php artisan serve
```

---

## 12. Flujo Completo de la Aplicación

```
Usuario entra en /libros
        │
        ▼
LibroController@index
  → Eloquent: Libro::orderBy('titulo')->paginate(8)
  → Vista: libros/index.blade.php
        │
        ├── [Ver detalles] → libros.show → libros/show.blade.php
        │       ├── [Alquilar] → alquileres.create → alquileres/create.blade.php
        │       │       └── [POST] → AlquilerController@store
        │       │               → Crear alquiler + libro->disponible = false
        │       │               → redirect alquileres.index
        │       ├── [Editar]   → libros.edit → libros/edit.blade.php
        │       │               └── [PUT] → LibroController@update
        │       └── [Eliminar] → [DELETE] → LibroController@destroy
        │
        └── [Devolver libro] → [DELETE alquiler] → AlquilerController@destroy
                → Eliminar alquiler + libro->disponible = true
```

---

*Proyecto desarrollado con Laravel siguiendo el patrón MVC y las convenciones del framework.*
