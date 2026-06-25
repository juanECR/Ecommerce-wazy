<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    /**
     * Iniciar sesión y emitir un Token de acceso.
     */
    public function login(Request $request): JsonResponse
    {
        // 1. Validar que nos envíen correo y contraseña
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // 2. Intentar autenticar con la base de datos
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'success' => false,
                'message' => 'Credenciales incorrectas.'
            ], 401);
        }

        // 3. Obtener el usuario autenticado
        $user = Auth::user();

        // 4. Crear el Token de Sanctum
        $token = $user->createToken('token_de_acceso')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Inicio de sesión exitoso.',
            'data' => [
                'user' => $user,
                'token' => $token // ¡Esta es la llave que el frontend deberá guardar!
            ]
        ], 200);
    }

    /**
     * Cerrar sesión y destruir el Token.
     */
    public function logout(Request $request): JsonResponse
    {
        // Borra el token actual que está usando el usuario
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Sesión cerrada correctamente.'
        ], 200);
    }
}