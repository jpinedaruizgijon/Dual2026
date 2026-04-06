<?php

namespace App\Http\Controllers;

use App\Models\Libro;
use Illuminate\Http\Request;

class LibroController extends Controller
{
    public function index(Request $request)
    {
        $query = Libro::orderBy('titulo');

        if ($request->has('disponible')) {
            $query->where('disponible', true);
        }

        if ($request->filled('busqueda')) {
            $busqueda = $request->busqueda;
            $query->where(function ($q) use ($busqueda) {
                $q->where('titulo', 'like', '%' . $busqueda . '%')
                  ->orWhere('autor', 'like', '%' . $busqueda . '%');
            });
        }

        $libros = $query->paginate(8)->withQueryString();
        return view('libros.index', compact('libros'));
    }

    public function show(Libro $libro)
    {
        return view('libros.show', compact('libro'));
    }

    public function create()
    {
        return view('libros.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'titulo'           => 'required|max:255',
            'autor'            => 'required|max:255',
            'isbn'             => 'required|unique:libros,isbn|max:20',
            'genero'           => 'required',
            'anio_publicacion' => 'required|integer|min:1000|max:2100',
            'precio_dia'       => 'required|numeric|min:0',
            'sinopsis'         => 'nullable|max:2000',
        ]);

        Libro::create($request->all());
        return redirect()->route('libros.index');
    }

    public function edit(Libro $libro)
    {
        return view('libros.edit', compact('libro'));
    }

    public function update(Libro $libro, Request $request)
    {
        $request->validate([
            'titulo'           => 'required|max:255',
            'autor'            => 'required|max:255',
            'precio_dia'       => 'required|numeric|min:0',
            'anio_publicacion' => 'required|integer|min:1000|max:2100',
            'sinopsis'         => 'nullable|max:2000',
        ]);

        $libro->update($request->all());
        return redirect()->route('libros.show', $libro);
    }

    public function destroy(Libro $libro)
    {
        $libro->delete();
        return redirect()->route('libros.index');
    }
}
