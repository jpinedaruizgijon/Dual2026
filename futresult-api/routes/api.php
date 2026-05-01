<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FavoritoController;

// CRUD de favoritos
//  GET    /api/favoritos          → index
//  POST   /api/favoritos          → store
//  GET    /api/favoritos/{id}     → show
//  PUT    /api/favoritos/{id}     → update
//  DELETE /api/favoritos/{id}     → destroy
Route::apiResource('favoritos', FavoritoController::class);
