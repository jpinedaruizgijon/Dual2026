<?php

namespace App\Http\Controllers;

use App\Models\Alquiler;
use App\Models\Libro;
use Illuminate\Http\Request;

class AlquilerController extends Controller
{
    public function index()
    {
        $alquileres = Alquiler::with('libro')->orderBy('fecha_inicio', 'desc')->get();
        return view('alquileres.index', compact('alquileres'));
    }

    public function create(Libro $libro)
    {
        return view('alquileres.create', compact('libro'));
    }

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

        $libro = Libro::find($request->libro_id);
        $libro->disponible = false;
        $libro->save();

        return redirect()->route('alquileres.index');
    }

    public function destroy(Alquiler $alquiler)
    {
        $libro = $alquiler->libro;
        $alquiler->delete();

        $libro->disponible = true;
        $libro->save();

        return redirect()->route('alquileres.index');
    }
}
