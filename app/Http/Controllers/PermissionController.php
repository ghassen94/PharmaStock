<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PermissionController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', Permission::class);
        $permissions = Permission::all();
        return Inertia::render('Permissions/Index', compact('permissions'));
    }

    public function create()
    {
        $this->authorize('create', Permission::class);
        return Inertia::render('Permissions/Create');
    }

    public function store(Request $request)
    {
        $this->authorize('create', Permission::class);
        $request->validate(['name' => 'required|string|unique:permissions,name']);
        Permission::create(['name' => $request->name]);
        return redirect()->route('permissions.index')->with('success', 'Permission created');
    }

    public function edit(Permission $permission)
    {
        $this->authorize('update', $permission);
        return Inertia::render('Permissions/Edit', compact('permission'));
    }

    public function update(Request $request, Permission $permission)
    {
        $this->authorize('update', $permission);
        $request->validate(['name' => 'required|string|unique:permissions,name,' . $permission->id]);
        $permission->update(['name' => $request->name]);
        return Inertia::location(route('permissions.index'));
    }

    public function destroy(Permission $permission)
    {
        $this->authorize('delete', $permission);
        $permission->delete();
        return redirect()->back()->with('success', 'Permission deleted');
    }
}
