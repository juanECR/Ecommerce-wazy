<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Exception;
use Illuminate\Support\Facades\Mail;
use App\Mail\ReceiptEmail;

class SaleController extends Controller
{
    /**
     * Muestra una lista de todas las ventas para el Panel Administrativo.
     */
    public function index(): JsonResponse
    {
        // Traemos todas las ventas, ordenadas desde la más reciente a la más antigua
        $sales = Sale::orderBy('created_at', 'desc')->get();
        
        return response()->json([
            'success' => true,
            'data' => $sales
        ], 200);
    }

    /**
     * Registra una nueva venta, sus detalles y descuenta el stock.
     */
    public function store(Request $request): JsonResponse
    {
        // 1. Validar los datos de entrada
        $request->validate([
            'buyer_name'          => 'required|string|max:255',
            'buyer_document'      => 'required|string|max:20',
            'buyer_phone'         => 'required|string|max:20',
            'buyer_email'         => 'required|email|max:255',
            'shipping_address'    => 'required|string',
            'shipping_department' => 'required|string',
            'shipping_province'   => 'required|string',
            'shipping_district'   => 'required|string',
            'products'            => 'required|array|min:1', // Debe haber al menos un producto
            'products.*.id'       => 'required|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
        ]);

        try {
            // 2. Iniciar la Transacción
            $sale = DB::transaction(function () use ($request) {
                
                $totalAmount = 0;
                $detailsToInsert = [];
                $productsToUpdate = [];

                // 3. Procesar cada producto solicitado
                foreach ($request->products as $item) {
                    // Bloqueamos la fila del producto temporalmente (pessimistic locking) 
                    // para evitar que dos clientes compren el último artículo al mismo segundo
                    $product = Product::lockForUpdate()->find($item['id']);

                    // Verificar stock
                    if ($product->stock < $item['quantity']) {
                        throw new Exception("Stock insuficiente para el producto: {$product->name}");
                    }

                    // Calcular subtotales usando el precio de la Base de Datos (Nunca confiar en el precio enviado desde el frontend)
                    $subtotal = $product->sale_price * $item['quantity'];
                    $totalAmount += $subtotal;

                    // Preparar los datos del detalle
                    $detailsToInsert[] = [
                        'product_id' => $product->id,
                        'quantity'   => $item['quantity'],
                        'price'      => $product->sale_price,
                        'subtotal'   => $subtotal,
                    ];

                    // Preparar el producto para descontar stock
                    $productsToUpdate[] = [
                        'product' => $product,
                        'quantity_to_subtract' => $item['quantity']
                    ];
                }

                // 4. Crear el registro principal de la Venta
                $sale = Sale::create([
                    'order_number'        => 'IMP-' . date('Y') . '-' . strtoupper(uniqid()),
                    'total_amount'        => $totalAmount,
                    'buyer_name'          => $request->buyer_name,
                    'buyer_document'      => $request->buyer_document,
                    'buyer_phone'         => $request->buyer_phone,
                    'buyer_email'         => $request->buyer_email,
                    'shipping_address'    => $request->shipping_address,
                    'shipping_department' => $request->shipping_department,
                    'shipping_province'   => $request->shipping_province,
                    'shipping_district'   => $request->shipping_district,
                    'payment_status'      => 'paid', // Asumimos pagado para este ejemplo
                    'shipping_status'     => 'pending',
                ]);

                // 5. Insertar los detalles
                $sale->details()->createMany($detailsToInsert);

                // 6. Descontar el stock físico del almacén
                foreach ($productsToUpdate as $update) {
                    $prod = $update['product'];
                    $prod->stock -= $update['quantity_to_subtract'];
                    $prod->save();
                }
                // Cargar los detalles
                $sale->load('details.product');

                // 7. ENVIAR EL CORREO ELECTRÓNICO (NUEVO)
                Mail::to($sale->buyer_email)->send(new ReceiptEmail($sale));

                return $sale;
            });

            // Si todo salió bien, retornamos éxito
            return response()->json([
                'success' => true,
                'message' => 'Orden procesada y stock actualizado correctamente.',
                'data'    => $sale
            ], 201);

        } catch (Exception $e) {
            // Si falta stock o hay algún error, se cancela todo automáticamente
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar la venta: ' . $e->getMessage()
            ], 400);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
