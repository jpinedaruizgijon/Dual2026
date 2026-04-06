@extends('layouts.plantilla')
@section('titulo', 'Anadir libro')
@section('contenido')

    <div class="form-container">
        <h1>Anadir nuevo libro</h1>

        <form action="{{ route('libros.store') }}" method="POST" class="form-libro">
            @csrf

            <div class="form-grupo">
                <label for="titulo">Titulo *</label>
                <input type="text" id="titulo" name="titulo" value="{{ old('titulo') }}"
                       class="{{ $errors->has('titulo') ? 'input-error' : '' }}">
                @error('titulo') <span class="error">{{ $message }}</span> @enderror
            </div>

            <div class="form-grupo">
                <label for="autor">Autor *</label>
                <input type="text" id="autor" name="autor" value="{{ old('autor') }}"
                       class="{{ $errors->has('autor') ? 'input-error' : '' }}">
                @error('autor') <span class="error">{{ $message }}</span> @enderror
            </div>

            <div class="form-fila">
                <div class="form-grupo">
                    <label for="isbn">ISBN *</label>
                    <input type="text" id="isbn" name="isbn" value="{{ old('isbn') }}"
                           class="{{ $errors->has('isbn') ? 'input-error' : '' }}">
                    @error('isbn') <span class="error">{{ $message }}</span> @enderror
                </div>

                <div class="form-grupo">
                    <label for="genero">Genero *</label>
                    <select id="genero" name="genero">
                        <option value="">-- Selecciona --</option>
                        @foreach (['Novela','Ciencia Ficcion','Historia','Thriller','Poesia','Ensayo','Fantasia','Biografia','Terror','Romance'] as $g)
                            <option value="{{ $g }}" {{ old('genero') == $g ? 'selected' : '' }}>{{ $g }}</option>
                        @endforeach
                    </select>
                    @error('genero') <span class="error">{{ $message }}</span> @enderror
                </div>
            </div>

            <div class="form-fila">
                <div class="form-grupo">
                    <label for="anio_publicacion">Año de publicacion *</label>
                    <input type="number" id="anio_publicacion" name="anio_publicacion"
                           min="1000" max="2100" value="{{ old('anio_publicacion') }}"
                           class="{{ $errors->has('anio_publicacion') ? 'input-error' : '' }}">
                    @error('anio_publicacion') <span class="error">{{ $message }}</span> @enderror
                </div>

                <div class="form-grupo">
                    <label for="precio_dia">Precio por dia (EUR) *</label>
                    <input type="number" id="precio_dia" name="precio_dia"
                           step="0.01" min="0" value="{{ old('precio_dia') }}"
                           class="{{ $errors->has('precio_dia') ? 'input-error' : '' }}">
                    @error('precio_dia') <span class="error">{{ $message }}</span> @enderror
                </div>
            </div>

            <div class="form-grupo">
                <label for="sinopsis">Sinopsis</label>
                <textarea id="sinopsis" name="sinopsis" rows="5">{{ old('sinopsis') }}</textarea>
            </div>

            <div class="form-acciones">
                <a href="{{ route('libros.index') }}" class="btn btn-secundario">Cancelar</a>
                <button type="submit" class="btn btn-primario">Guardar libro</button>
            </div>
        </form>
    </div>

@endsection
