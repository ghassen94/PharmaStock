<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', Product::class);
        $products = Product::with('category')->get();
        $categories = Category::all();
        return Inertia::render('Products/Index', compact('products', 'categories'));
    }

    public function create()
    {
        $this->authorize('create', Product::class);
        $categories = Category::all();
        return Inertia::render('Products/Create', compact('categories'));
    }

    public function store(StoreProductRequest $request)
    {
        $product = Product::create($request->validated());
        return redirect()->route('products.index')->with('success', 'Product created');
    }

    public function edit(Product $product)
    {
        $this->authorize('update', $product);
        $categories = Category::all();
        return Inertia::render('Products/Edit', [
            'product' => $product->load('category'),
            'categories' => $categories,
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $product->update($request->validated());
        return Inertia::location(route('products.index'));
    }

    public function destroy(Request $request, Product $product)
    {
        $this->authorize('delete', $product);
        $product->delete();
        return redirect()->back()->with('success', 'Product deleted');
    }
}
