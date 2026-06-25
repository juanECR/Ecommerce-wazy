<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Usuario Administrador (Tú)
        User::create([
            'name' => 'Administrador General',
            'email' => 'admin@importaciones.com',
            'password' => Hash::make('password123'), // Contraseña de prueba
        ]);

        // Usuario Operario de Almacén
        User::create([
            'name' => 'Operario de Almacén',
            'email' => 'almacen@importaciones.com',
            'password' => Hash::make('password123'),
        ]);
    }
}
