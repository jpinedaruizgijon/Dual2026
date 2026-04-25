<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FavoritoController;

// apiResource registra automáticamente los 5 endpoints REST estándar:
//
//  GET    /api/favoritos          → FavoritoController@index   (listar todos)
//  POST   /api/favoritos          → FavoritoController@store   (crear)
//  GET    /api/favoritos/{id}     → FavoritoController@show    (ver uno)
//  PUT    /api/favoritos/{id}     → FavoritoController@update  (actualizar)
//  DELETE /api/favoritos/{id}     → FavoritoController@destroy (eliminar)
//
// Con una sola línea tenemos todo el CRUD registrado.
Route::apiResource('favoritos', FavoritoController::class);
