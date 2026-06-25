<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('products', function (Blueprint $table) {
        $table->id();
        // Relación con categorías (si se borra una categoría, impide el borrado si tiene productos)
        $table->foreignId('category_id')->constrained()->restrictOnDelete();
        
        $table->string('sku')->unique(); // Código de barra o identificador único
        $table->string('name');
        $table->text('description')->nullable();
        
        // Costos y Precios (Decimales para precisión financiera)
        $table->decimal('purchase_price', 10, 2); // Costo de importación
        $table->decimal('sale_price', 10, 2);    // Precio de venta en Perú
        
        // Inventario
        $table->integer('stock')->default(0);
        $table->integer('minimum_stock')->default(5); // Alerta de reposición
        
        // Gestión de Imágenes
        $table->string('cover_image')->nullable(); // Imagen principal
        $table->json('gallery')->nullable();       // Array de imágenes secundarias
        
        $table->boolean('status')->default(true); // Activo / Inactivo
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
