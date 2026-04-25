<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Las migraciones en Laravel son como un control de versiones de la base de datos.
// Este fichero define la estructura de la tabla 'favoritos'.
// Con 'php artisan migrate' se crea la tabla, y con 'migrate:rollback' se elimina.
return new class extends Migration
{
    // Se ejecuta al correr 'php artisan migrate' — crea la tabla
    public function up(): void
    {
        Schema::create('favoritos', function (Blueprint $table) {
            $table->id();                           // Columna 'id' autoincremental (clave primaria)
            $table->string('equipo');               // Nombre del equipo
            $table->string('liga');                 // Liga a la que pertenece
            $table->string('pais');                 // País del equipo
            $table->string('nota')->nullable();     // Nota personal (puede estar vacía)
            $table->timestamps();                   // Crea 'created_at' y 'updated_at' automáticamente
        });
    }

    // Se ejecuta al correr 'php artisan migrate:rollback' — deshace la migración
    public function down(): void
    {
        Schema::dropIfExists('favoritos');
    }
};
