<?php

use App\Http\Controllers\LibroController;
use App\Http\Controllers\AlquilerController;
use Illuminate\Support\Facades\Route;

Route::get('/libros',                    [LibroController::class, 'index'])->name('libros.index');
Route::get('/libros/create',             [LibroController::class, 'create'])->name('libros.create');
Route::post('/libros',                   [LibroController::class, 'store'])->name('libros.store');
Route::get('/libros/{libro}',            [LibroController::class, 'show'])->name('libros.show');
Route::get('/libros/{libro}/edit',       [LibroController::class, 'edit'])->name('libros.edit');
Route::put('/libros/{libro}',            [LibroController::class, 'update'])->name('libros.update');
Route::delete('/libros/{libro}',         [LibroController::class, 'destroy'])->name('libros.destroy');

Route::get('/alquileres',                [AlquilerController::class, 'index'])->name('alquileres.index');
Route::get('/alquileres/create/{libro}', [AlquilerController::class, 'create'])->name('alquileres.create');
Route::post('/alquileres',               [AlquilerController::class, 'store'])->name('alquileres.store');
Route::delete('/alquileres/{alquiler}',  [AlquilerController::class, 'destroy'])->name('alquileres.destroy');

Route::redirect('/', '/libros');
