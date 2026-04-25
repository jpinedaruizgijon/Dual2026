<?php

namespace App\Http\Controllers;

use App\Models\Favorito;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

// El controlador gestiona cada petición HTTP y devuelve una respuesta JSON.
// Laravel inyecta automáticamente el modelo Favorito cuando la URL tiene un {favorito},
// buscándolo en la base de datos por su id (esto se llama Route Model Binding).
class FavoritoController extends Controller
{
    // GET /api/favoritos — Devuelve todos los favoritos
    public function index(): JsonResponse
    {
        // Favorito::all() genera: SELECT * FROM favoritos
        $favoritos = Favorito::all();
        return response()->json($favoritos);
    }

    // GET /api/favoritos/{id} — Devuelve un favorito concreto
    // Si el id no existe, Laravel devuelve automáticamente un 404
    public function show(Favorito $favorito): JsonResponse
    {
        return response()->json($favorito);
    }

    // POST /api/favoritos — Crea un nuevo favorito
    public function store(Request $request): JsonResponse
    {
        // validate() comprueba que los campos obligatorios lleguen correctamente.
        // Si la validación falla, Laravel devuelve un 422 con los errores automáticamente.
        $request->validate([
            'equipo' => 'required|string|max:100',
            'liga'   => 'required|string|max:100',
            'pais'   => 'required|string|max:100',
            'nota'   => 'nullable|string|max:255',
        ]);

        // create() inserta la fila en la base de datos y devuelve el objeto creado con su id
        $favorito = Favorito::create($request->all());

        // Devolvemos el objeto creado con código 201 (Created)
        return response()->json($favorito, 201);
    }

    // PUT /api/favoritos/{id} — Actualiza un favorito existente
    public function update(Request $request, Favorito $favorito): JsonResponse
    {
        $request->validate([
            'equipo' => 'required|string|max:100',
            'liga'   => 'required|string|max:100',
            'pais'   => 'required|string|max:100',
            'nota'   => 'nullable|string|max:255',
        ]);

        // update() genera: UPDATE favoritos SET ... WHERE id = ?
        $favorito->update($request->all());

        return response()->json($favorito);
    }

    // DELETE /api/favoritos/{id} — Elimina un favorito
    public function destroy(Favorito $favorito): JsonResponse
    {
        $favorito->delete();

        // 204 No Content: la petición fue bien pero no hay nada que devolver
        return response()->json(null, 204);
    }
}
