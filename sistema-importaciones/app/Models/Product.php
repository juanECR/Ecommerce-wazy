<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    protected $fillable = [
        'category_id', 'sku', 'name', 'description',
        'purchase_price', 'sale_price', 'stock', 'minimum_stock',
        'cover_image', 'gallery', 'status'
    ];

    // Formateo automático de tipos de datos
    protected function casts(): array
    {
        return [
            'gallery' => 'array', // Convierte el JSON de la BD a Array de PHP automáticamente
            'status' => 'boolean',
            'purchase_price' => 'decimal:2',
            'sale_price' => 'decimal:2',
        ];
    }

    // Relación: Un producto pertenece a una categoría
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
