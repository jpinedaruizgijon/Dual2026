@extends('layouts.plantilla')
@section('titulo', 'Alquileres activos')
@section('contenido')

    <div class="page-header">
        <h1>Alquileres activos</h1>
        <p class="subtitle">{{ count($alquileres) }} alquileres registrados</p>
    </div>

    @if ($alquileres->isEmpty())
        <div class="empty-state">
            <p>No hay alquileres registrados.</p>
            <a href="{{ route('libros.index') }}" class="btn btn-primario">Ver catalogo</a>
        </div>
    @else
        <div class="tabla-container">
            <table class="tabla-alquileres">
                <thead>
                    <tr>
                        <th>Libro</th>
                        <th>Cliente</th>
                        <th>Email</th>
                        <th>Fecha inicio</th>
                        <th>Fecha fin</th>
                        <th>Dias</th>
                        <th>Total</th>
                        <th>Accion</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($alquileres as $alquiler)
                        @php
                            $dias = $alquiler->fecha_inicio->diffInDays($alquiler->fecha_fin);
                            $total = $dias * $alquiler->libro->precio_dia;
                        @endphp
                        <tr>
                            <td>
                                <a href="{{ route('libros.show', $alquiler->libro) }}">
                                    {{ $alquiler->libro->titulo }}
                                </a>
                            </td>
                            <td>{{ $alquiler->nombre_cliente }}</td>
                            <td>{{ $alquiler->email_cliente }}</td>
                            <td>{{ $alquiler->fecha_inicio->format('d/m/Y') }}</td>
                            <td>{{ $alquiler->fecha_fin->format('d/m/Y') }}</td>
                            <td>{{ $dias }}</td>
                            <td>{{ number_format($total, 2) }} EUR</td>
                            <td>
                                <form action="{{ route('alquileres.destroy', $alquiler) }}" method="POST"
                                      onsubmit="return confirm('Confirmar devolucion del libro?')">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="btn-devolver">Devolver</button>
                                </form>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    @endif

@endsection
