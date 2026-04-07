@extends('layouts.plantilla')
@section('titulo', 'Catalogo de libros')
@section('contenido')

    <div class="page-header">
        <h1>Catalogo de libros</h1>
        <p class="subtitle">{{ $libros->count() }} libros en el sistema</p>
    </div>

    <div class="filtros">
        <form method="GET" action="{{ route('libros.index') }}" class="form-busqueda">
            <input type="text" name="busqueda" placeholder="Buscar por titulo o autor..."
                   value="{{ request('busqueda') }}" class="input-busqueda">
            <button type="submit" class="btn btn-secundario">Buscar</button>
        </form>
        <div class="filtros-links">
            <a href="{{ route('libros.index') }}"
               class="btn-filtro {{ !request()->has('disponible') ? 'activo' : '' }}">
                Todos
            </a>
            <a href="{{ route('libros.index', ['disponible' => 1]) }}"
               class="btn-filtro {{ request()->has('disponible') ? 'activo' : '' }}">
                Solo disponibles
            </a>
        </div>
    </div>

    @if ($libros->isEmpty())
        <div class="empty-state">
            <p>No se encontraron libros.</p>
            <a href="{{ route('libros.index') }}" class="btn btn-secundario">Ver todos</a>
        </div>
    @else
        <div class="grid-libros">
            @foreach ($libros as $libro)
                <div class="tarjeta-libro {{ $libro->disponible ? '' : 'no-disponible' }}">
                    <div class="tarjeta-genero">{{ $libro->genero }}</div>
                    <h2 class="tarjeta-titulo">{{ $libro->titulo }}</h2>
                    <p class="tarjeta-autor">{{ $libro->autor }}</p>
                    <p class="tarjeta-anio">{{ $libro->anio_publicacion }}</p>
                    <div class="tarjeta-footer">
                        <span class="estado {{ $libro->disponible ? 'disponible' : 'ocupado' }}">
                            {{ $libro->disponible ? 'Disponible' : 'Alquilado' }}
                        </span>
                        <span class="precio">{{ number_format($libro->precio_dia, 2) }}EUR/dia</span>
                    </div>
                    <a href="{{ route('libros.show', $libro) }}" class="btn-ver">Ver detalles</a>
                </div>
            @endforeach
        </div>

    @endif

@endsection
