<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Libro extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'disponible' => 'boolean',
    ];

    public function alquileres()
    {
        return $this->hasMany(Alquiler::class);
    }
}
