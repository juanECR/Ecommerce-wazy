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
    Schema::create('sale_details', function (Blueprint $table) {
        $table->id();
        // Si se elimina una venta, se eliminan sus detalles en cascada
        $table->foreignId('sale_id')->constrained()->onDelete('cascade');
        // Impide borrar un producto si ya forma parte de un historial de ventas
        $table->foreignId('product_id')->constrained()->restrictOnDelete();
        
        $table->integer('quantity');
        $table->decimal('price', 10, 2); // Precio capturado al momento de la venta
        $table->decimal('subtotal', 10, 2);
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sale_details');
    }
};
