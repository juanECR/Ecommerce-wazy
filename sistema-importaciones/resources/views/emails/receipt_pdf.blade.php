<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Recibo</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 14px; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .total { font-weight: bold; font-size: 16px; text-align: right; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Recibo de Compra</h1>
        <p>Orden: {{ $sale->order_number }}</p>
        <p>Fecha: {{ $sale->created_at->format('d/m/Y') }}</p>
    </div>

    <div>
        <h3>Datos del Cliente:</h3>
        <p><strong>Nombre:</strong> {{ $sale->buyer_name }}</p>
        <p><strong>Documento:</strong> {{ $sale->buyer_document }}</p>
        <p><strong>Dirección de Envío:</strong> {{ $sale->shipping_address }}, {{ $sale->shipping_district }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unit.</th>
                <th>Subtotal</th>
            </tr>
        </thead>
        <tbody>
            @foreach($sale->details as $detail)
            <tr>
                <td>{{ $detail->product->name }}</td>
                <td>{{ $detail->quantity }}</td>
                <td>S/ {{ number_format($detail->price, 2) }}</td>
                <td>S/ {{ number_format($detail->subtotal, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr>
                <td colspan="3" class="total">Total:</td>
                <td class="total">S/ {{ number_format($sale->total_amount, 2) }}</td>
            </tr>
        </tfoot>
    </table>
</body>
</html>