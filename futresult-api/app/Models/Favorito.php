<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

// El modelo Favorito representa una fila de la tabla 'favoritos'.
// Eloquent es el ORM de Laravel: nos permite interactuar con la base de datos
// usando objetos PHP en lugar de escribir SQL directamente.
class Favorito extends Model
{
    // $fillable indica qué campos se pueden rellenar de forma masiva
    // (por ejemplo al hacer Favorito::create($request->all())).
    // Es una medida de seguridad: evita que se asignen campos no deseados.
    protected $fillable = [
        'equipo',
        'liga',
        'pais',
        'nota',
    ];
}
