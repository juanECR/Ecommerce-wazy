<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
/**
     * Muestra una lista de los productos (Para tu catálogo web o panel).
     */
    public function index(): JsonResponse
    {
        // Trae los productos activos con los datos de su categoría
        $products = Product::with('category')->where('status', true)->get();
        
        return response()->json([
            'success' => true,
            'data' => $products
        ], 200);
    }

/**
     * Registra un nuevo producto con imágenes en el sistema.
     */
    public function store(Request $request): JsonResponse
    {
        // 1. Validar los datos que vienen del frontend o Postman
        $request->validate([
            'category_id'    => 'required|exists:categories,id',
            'sku'            => 'required|string|unique:products,sku',
            'name'           => 'required|string|max:255',
            'description'    => 'nullable|string',
            'purchase_price' => 'required|numeric|min:0',
            'sale_price'     => 'required|numeric|min:0',
            'stock'          => 'required|integer|min:0',
            'minimum_stock'  => 'nullable|integer|min:0',
            'cover_image'    => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048', // Máx 2MB
            'gallery.*'      => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048'  // Array de imágenes
        ]);

        // 2. Procesar la Imagen de Portada (Cover)
        $coverPath = null;
        if ($request->hasFile('cover_image')) {
            // Guarda en storage/app/public/products y devuelve la ruta relativa
            $coverPath = $request->file('cover_image')->store('products', 'public');
        }

        // 3. Procesar la Galería de Imágenes Secundarias
        $galleryPaths = [];
        if ($request->hasFile('gallery')) {
            foreach ($request->file('gallery') as $image) {
                $galleryPaths[] = $image->store('products', 'public');
            }
        }

        // 4. Guardar el producto en la Base de Datos
        $product = Product::create([
            'category_id'    => $request->category_id,
            'sku'            => $request->sku,
            'name'           => $request->name,
            'description'    => $request->description,
            'purchase_price' => $request->purchase_price,
            'sale_price'     => $request->sale_price,
            'stock'          => $request->stock,
            'minimum_stock'  => $request->minimum_stock ?? 5,
            'cover_image'    => $coverPath,
            'gallery'        => !empty($galleryPaths) ? $galleryPaths : null,
            'status'         => true,
        ]);

        // 5. Retornar respuesta JSON de éxito
        return response()->json([
            'success' => true,
            'message' => 'Producto registrado exitosamente en el sistema.',
            'data'    => $product
        ], 201);
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
