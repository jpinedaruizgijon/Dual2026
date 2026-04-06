@extends('layouts.plantilla')
@section('titulo', 'Editar libro')
@section('contenido')

    <div class="form-container">
        <h1>Editar libro</h1>
        <p class="subtitle">{{ $libro->titulo }}</p>

        <form action="{{ route('libros.update', $libro) }}" method="POST" class="form-libro">
            @csrf
            @method('PUT')

            <div class="form-grupo">
                <label for="titulo">Titulo *</label>
                <input type="text" id="titulo" name="titulo"
                       value="{{ old('titulo', $libro->titulo) }}"
                       class="{{ $errors->has('titulo') ? 'input-error' : '' }}">
                @error('titulo') <span class="error">{{ $message }}</span> @enderror
            </div>

            <div class="form-grupo">
                <label for="autor">Autor *</label>
                <input type="text" id="autor" name="autor"
                       value="{{ old('autor', $libro->autor) }}"
                       class="{{ $errors->has('autor') ? 'input-error' : '' }}">
                @error('autor') <span class="error">{{ $message }}</span> @enderror
            </div>

            <div class="form-fila">
                <div class="form-grupo">
                    <label for="genero">Genero *</label>
                    <select id="genero" name="genero">
                        @foreach (['Novela','Ciencia Ficcion','Historia','Thriller','Poesia','Ensayo','Fantasia','Biografia','Terror','Romance'] as $g)
                            <option value="{{ $g }}" {{ old('genero', $libro->genero) == $g ? 'selected' : '' }}>{{ $g }}</option>
                        @endforeach
                    </select>
                </div>

                <div class="form-grupo">
                    <label for="anio_publicacion">Año de publicacion *</label>
                    <input type="number" id="anio_publicacion" name="anio_publicacion"
                           min="1000" max="2100"
                           value="{{ old('anio_publicacion', $libro->anio_publicacion) }}"
                           class="{{ $errors->has('anio_publicacion') ? 'input-error' : '' }}">
                    @error('anio_publicacion') <span class="error">{{ $message }}</span> @enderror
                </div>
            </div>

            <div class="form-grupo">
                <label for="precio_dia">Precio por dia (EUR) *</label>
                <input type="number" id="precio_dia" name="precio_dia"
                       step="0.01" min="0"
                       value="{{ old('precio_dia', $libro->precio_dia) }}"
                       class="{{ $errors->has('precio_dia') ? 'input-error' : '' }}">
                @error('precio_dia') <span class="error">{{ $message }}</span> @enderror
            </div>

            <div class="form-grupo">
                <label for="sinopsis">Sinopsis</label>
                <textarea id="sinopsis" name="sinopsis" rows="5">{{ old('sinopsis', $libro->sinopsis) }}</textarea>
            </div>

            <div class="form-grupo form-grupo-check">
                <label>
                    <input type="hidden" name="disponible" value="0">
                    <input type="checkbox" name="disponible" value="1"
                           {{ old('disponible', $libro->disponible) ? 'checked' : '' }}>
                    Disponible para alquiler
                </label>
            </div>

            <div class="form-acciones">
                <a href="{{ route('libros.show', $libro) }}" class="btn btn-secundario">Cancelar</a>
                <button type="submit" class="btn btn-primario">Guardar cambios</button>
            </div>
        </form>
    </div>

@endsection
