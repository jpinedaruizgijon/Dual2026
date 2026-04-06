<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('libros', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->string('autor');
            $table->string('isbn', 20)->unique();
            $table->string('genero');
            $table->year('anio_publicacion');
            $table->text('sinopsis')->nullable();
            $table->decimal('precio_dia', 5, 2);
            $table->boolean('disponible')->default(true);
            $table->string('portada')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('libros');
    }
};
