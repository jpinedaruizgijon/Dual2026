@extends('layouts.plantilla')
@section('titulo', $libro->titulo)
@section('contenido')

    <div class="detalle-container">
        <div class="detalle-header">
            <a href="{{ route('libros.index') }}" class="btn-volver">&larr; Volver al catalogo</a>
            <span class="badge-genero">{{ $libro->genero }}</span>
        </div>

        <div class="detalle-body">
            <div class="detalle-info">
                <h1>{{ $libro->titulo }}</h1>
                <p class="detalle-autor">{{ $libro->autor }}</p>

                <table class="tabla-detalle">
                    <tr><th>ISBN</th><td>{{ $libro->isbn }}</td></tr>
                    <tr><th>Genero</th><td>{{ $libro->genero }}</td></tr>
                    <tr><th>Año de publicacion</th><td>{{ $libro->anio_publicacion }}</td></tr>
                    <tr><th>Precio por dia</th><td>{{ number_format($libro->precio_dia, 2) }} EUR</td></tr>
                    <tr>
                        <th>Estado</th>
                        <td>
                            @if ($libro->disponible)
                                <span class="estado disponible">Disponible</span>
                            @else
                                <span class="estado ocupado">Alquilado actualmente</span>
                            @endif
                        </td>
                    </tr>
                </table>

                @if ($libro->sinopsis)
                    <div class="sinopsis">
                        <h3>Sinopsis</h3>
                        <p>{{ $libro->sinopsis }}</p>
                    </div>
                @endif
            </div>

            <div class="detalle-acciones">
                @if ($libro->disponible)
                    <a href="{{ route('alquileres.create', $libro) }}" class="btn btn-alquilar">
                        Alquilar este libro
                    </a>
                @else
                    <p class="aviso-no-disponible">Este libro no esta disponible actualmente.</p>
                @endif

                <a href="{{ route('libros.edit', $libro) }}" class="btn btn-editar">Editar</a>

                <form action="{{ route('libros.destroy', $libro) }}" method="POST"
                      onsubmit="return confirm('Seguro que quieres eliminar este libro?')">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="btn btn-eliminar">Eliminar</button>
                </form>
            </div>
        </div>
    </div>

@endsection
