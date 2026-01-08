<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\Permission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', Role::class);
        $roles = Role::with('permissions')->get();
        $permissions = \App\Models\Permission::all();
        return Inertia::render('Roles/Index', compact('roles', 'permissions'));
    }

    public function store(Request $request)
    {
        $this->authorize('create', Role::class);
        $request->validate(['name' => 'required|string|unique:roles,name']);
        $role = Role::create(['name' => $request->name]);
        if ($request->permissions) {
            $role->permissions()->sync($request->permissions);
        }
        return redirect()->back()->with('success', 'Role created');
    }

    public function update(Request $request, Role $role)
    {
        $this->authorize('update', $role);
        $request->validate(['name' => 'required|string|unique:roles,name,' . $role->id]);
        $role->update(['name' => $request->name]);
        $role->permissions()->sync($request->permissions ?? []);
        return redirect()->back()->with('success', 'Role updated');
    }

    public function destroy(Role $role)
    {
        $this->authorize('delete', $role);
        $role->delete();
        return redirect()->back()->with('success', 'Role deleted');
    }
}