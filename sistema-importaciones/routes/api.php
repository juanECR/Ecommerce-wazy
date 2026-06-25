<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\SaleController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;

// ==========================================
// RUTAS PÚBLICAS (Para la web / Clientes)
// ==========================================

// 1. Iniciar sesión en el panel de administración
Route::post('login', [AuthController::class, 'login']);

// 2. Listar productos (Para que el catálogo de la web funcione)
// Usamos solo 'index' y 'show' para que el público solo pueda ver, no modificar.
Route::apiResource('productos', ProductController::class)->only(['index', 'show']);

// 3. Crear una Venta (El Checkout Público)
// Permite que un cliente registre su compra y reciba su PDF sin estar logueado.
Route::post('ventas', [SaleController::class, 'store']);


// ==========================================
// RUTAS PRIVADAS (Para el Panel de Control)
// ==========================================
Route::middleware('auth:sanctum')->group(function () {
    
    // 1. Cerrar sesión del panel
    Route::post('logout', [AuthController::class, 'logout']);

    // 2. Gestión de Productos (Crear, Actualizar, Borrar)
    // Usamos 'except' porque el listado ya lo hicimos público arriba.
    Route::apiResource('productos', ProductController::class)->except(['index', 'show']);

    // 3. Gestión de Ventas (Listar historial, Actualizar estado, Borrar)
    // Permite al personal administrar los pedidos.
    Route::apiResource('ventas', SaleController::class)->except(['store']);
    // Agregar dentro del grupo middleware('auth:sanctum')
    Route::get('categorias', [CategoryController::class, 'index']);

});