<!DOCTYPE html>
<html lang="es">
<body>
    <h2>¡Gracias por tu compra, {{ $sale->buyer_name }}!</h2>
    <p>Hemos procesado tu pedido exitosamente.</p>
    <p><strong>Número de Orden:</strong> {{ $sale->order_number }}</p>
    <p>Adjunto a este correo encontrarás el recibo detallado en formato PDF con la información de tu compra y los datos de envío.</p>
    <br>
    <p>Saludos,</p>
    <p><strong>Tu Empresa de Importaciones</strong></p>
</body>
</html>