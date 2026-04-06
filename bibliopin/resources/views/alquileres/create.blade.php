@extends('layouts.plantilla')
@section('titulo', 'Alquilar libro')
@section('contenido')

    <div class="form-container">
        <h1>Registrar alquiler</h1>

        <div class="libro-resumen">
            <h2>{{ $libro->titulo }}</h2>
            <p>{{ $libro->autor }} &middot; {{ $libro->genero }}</p>
            <p class="precio-resumen">{{ number_format($libro->precio_dia, 2) }} EUR / dia</p>
        </div>

        <form action="{{ route('alquileres.store') }}" method="POST" class="form-libro">
            @csrf

            <input type="hidden" name="libro_id" value="{{ $libro->id }}">

            <div class="form-grupo">
                <label for="nombre_cliente">Nombre del cliente *</label>
                <input type="text" id="nombre_cliente" name="nombre_cliente"
                       value="{{ old('nombre_cliente') }}"
                       class="{{ $errors->has('nombre_cliente') ? 'input-error' : '' }}">
                @error('nombre_cliente') <span class="error">{{ $message }}</span> @enderror
            </div>

            <div class="form-grupo">
                <label for="email_cliente">Email del cliente *</label>
                <input type="email" id="email_cliente" name="email_cliente"
                       value="{{ old('email_cliente') }}"
                       class="{{ $errors->has('email_cliente') ? 'input-error' : '' }}">
                @error('email_cliente') <span class="error">{{ $message }}</span> @enderror
            </div>

            <div class="form-fila">
                <div class="form-grupo">
                    <label for="fecha_inicio">Fecha de inicio *</label>
                    <input type="date" id="fecha_inicio" name="fecha_inicio"
                           value="{{ old('fecha_inicio', date('Y-m-d')) }}"
                           class="{{ $errors->has('fecha_inicio') ? 'input-error' : '' }}">
                    @error('fecha_inicio') <span class="error">{{ $message }}</span> @enderror
                </div>

                <div class="form-grupo">
                    <label for="fecha_fin">Fecha de fin *</label>
                    <input type="date" id="fecha_fin" name="fecha_fin"
                           value="{{ old('fecha_fin') }}"
                           class="{{ $errors->has('fecha_fin') ? 'input-error' : '' }}">
                    @error('fecha_fin') <span class="error">{{ $message }}</span> @enderror
                </div>
            </div>

            <div class="form-acciones">
                <a href="{{ route('libros.show', $libro) }}" class="btn btn-secundario">Cancelar</a>
                <button type="submit" class="btn btn-alquilar">Confirmar alquiler</button>
            </div>
        </form>
    </div>

@endsection
