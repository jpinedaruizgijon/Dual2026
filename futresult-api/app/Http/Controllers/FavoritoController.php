<?php

namespace App\Http\Controllers;

use App\Models\Favorito;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class FavoritoController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Favorito::all());
    }

    public function show(Favorito $favorito): JsonResponse
    {
        return response()->json($favorito);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'equipo' => 'required|string|max:100',
            'liga'   => 'required|string|max:100',
            'pais'   => 'required|string|max:100',
            'nota'   => 'nullable|string|max:255',
        ]);

        $favorito = Favorito::create($request->all());

        return response()->json($favorito, 201);
    }

    public function update(Request $request, Favorito $favorito): JsonResponse
    {
        $request->validate([
            'equipo' => 'required|string|max:100',
            'liga'   => 'required|string|max:100',
            'pais'   => 'required|string|max:100',
            'nota'   => 'nullable|string|max:255',
        ]);

        $favorito->update($request->all());

        return response()->json($favorito);
    }

    public function destroy(Favorito $favorito): JsonResponse
    {
        $favorito->delete();

        return response()->json(null, 204);
    }
}
