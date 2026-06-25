<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Sale extends Model
{
    protected $fillable = [
        'order_number', 'total_amount', 
        'buyer_name', 'buyer_document', 'buyer_phone', 'buyer_email',
        'shipping_address', 'shipping_department', 'shipping_province', 'shipping_district',
        'payment_status', 'shipping_status'
    ];

    protected function casts(): array
    {
        return [
            'total_amount' => 'decimal:2',
        ];
    }

    // Una venta contiene múltiples productos en su detalle
    public function details(): HasMany
    {
        return $this->hasMany(SaleDetail::class);
    }
}
