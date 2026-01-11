<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', Category::class);
        $categories = Category::query()->get();
        return Inertia::render('Categories/Index', compact('categories'));
    }

    public function create()
    {
        $this->authorize('create', Category::class);
        return Inertia::render('Categories/Create');
    }

    public function store(StoreCategoryRequest $request)
    {
        $category = Category::create($request->validated());
        return redirect()->route('categories.index')->with('success', 'Category created');
    }

    public function edit(Category $category)
    {
        $this->authorize('update', $category);
        return Inertia::render('Categories/Edit', compact('category'));
    }

    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $category->update($request->validated());
        return Inertia::location(route('categories.index'));
    }

    public function destroy(Request $request, Category $category)
    {
        $this->authorize('delete', $category);
        $category->delete();
        return redirect()->back()->with('success', 'Category deleted');
    }
}
