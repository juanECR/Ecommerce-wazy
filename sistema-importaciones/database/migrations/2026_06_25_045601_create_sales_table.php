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
    Schema::create('sales', function (Blueprint $table) {
        $table->id();
        $table->string('order_number')->unique(); // Código único de pedido (ej: IMP-2026-0001)
        $table->decimal('total_amount', 10, 2);
        
        // Datos del Comprador Embebidos
        $table->string('buyer_name');
        $table->string('buyer_document'); // DNI o RUC
        $table->string('buyer_phone');
        $table->string('buyer_email');
        
        // Datos de Despacho / Logística
        $table->text('shipping_address');
        $table->string('shipping_department'); // Departamento
        $table->string('shipping_province');   // Provincia
        $table->string('shipping_district');   // Distrito
        
        // Estados del ciclo de la venta
        $table->string('payment_status')->default('pending');  // pending, paid, failed
        $table->string('shipping_status')->default('pending'); // pending, packed, shipped, delivered
        
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
};
