<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class LibroFactory extends Factory
{
    public function definition(): array
    {
        return [
            'titulo'           => $this->faker->sentence(3),
            'autor'            => $this->faker->name(),
            'isbn'             => $this->faker->unique()->isbn13(),
            'genero'           => $this->faker->randomElement([
                                    'Novela', 'Ciencia Ficcion', 'Historia',
                                    'Thriller', 'Poesia', 'Ensayo', 'Fantasia',
                                    'Biografia', 'Terror', 'Romance'
                                  ]),
            'anio_publicacion' => $this->faker->numberBetween(1950, 2024),
            'sinopsis'         => $this->faker->paragraph(4),
            'precio_dia'       => $this->faker->randomFloat(2, 0.50, 5.00),
            'disponible'       => $this->faker->boolean(80),
        ];
    }
}
