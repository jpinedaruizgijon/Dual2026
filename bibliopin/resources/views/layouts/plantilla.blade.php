<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('titulo', 'BiblioLaravel')</title>
    <link rel="stylesheet" href="{{ asset('css/estilos.css') }}">
</head>
<body>
    <header class="header">
        <div class="header-inner">
            <a href="{{ route('libros.index') }}" class="logo">BiblioLaravel</a>
            <nav class="nav">
                <a href="{{ route('libros.index') }}"
                   class="nav-link {{ request()->routeIs('libros*') ? 'activo' : '' }}">
                    Catalogo
                </a>
                <a href="{{ route('alquileres.index') }}"
                   class="nav-link {{ request()->routeIs('alquileres*') ? 'activo' : '' }}">
                    Alquileres
                </a>
                <a href="{{ route('libros.create') }}" class="nav-btn">+ Anadir libro</a>
            </nav>
        </div>
    </header>

    <main class="main">
        @yield('contenido')
    </main>

    <footer class="footer">
        <p>BiblioLaravel &copy; {{ date('Y') }} &mdash; Sistema de alquiler de libros</p>
    </footer>
</body>
</html>
