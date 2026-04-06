<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('alquileres', function (Blueprint $table) {
            $table->id();
            $table->string('nombre_cliente');
            $table->string('email_cliente');
            $table->date('fecha_inicio');
            $table->date('fecha_fin');
            $table->timestamps();
            $table->foreignId('libro_id')->constrained('libros');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('alquileres');
    }
};
