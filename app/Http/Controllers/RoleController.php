<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\Permission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class RoleController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', Role::class);
        $roles = Role::with('permissions')->get();
        $permissions = \App\Models\Permission::all();
        return Inertia::render('Roles/Index', compact('roles', 'permissions'));
    }

    public function create()
    {
        $this->authorize('create', Role::class);
        $permissions = Permission::all();
        /** @var User|null $user */
        $user = Auth::user();
        // Allow admins (by type or role) or anyone who has the 'permission.manage' permission
        $canAssignRestricted = $user && (
            ($user->type ?? null) === 'admin' ||
            (method_exists($user, 'hasRole') && $user->hasRole('admin')) ||
            (method_exists($user, 'can') && $user->can('permission.manage'))
        );

        return Inertia::render('Roles/Create', [
            'permissions' => $permissions,
            'canAssignRestricted' => $canAssignRestricted,
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Role::class);
        $request->validate(['name' => 'required|string|unique:roles,name']);
        $role = Role::create(['name' => $request->name]);
        // Only admins can assign product/category view permissions to 'user' or 'client' roles
        if ($request->permissions) {
            $restricted = ['product.view', 'category.view'];
            $roleName = strtolower($request->name);
            $permissionNames = Permission::whereIn('id', $request->permissions)->pluck('name')->toArray();

            /** @var User|null $user */
            $user = Auth::user();

            // Allow if user is type admin, has admin role, or has permission.manage
            $allowed = $user && (
                ($user->type ?? null) === 'admin' ||
                (method_exists($user, 'hasRole') && $user->hasRole('admin')) ||
                (method_exists($user, 'can') && $user->can('permission.manage'))
            );

            if (in_array($roleName, ['user', 'client']) && !$allowed) {
                if (count(array_intersect($restricted, $permissionNames)) > 0) {
                    abort(403, 'Only admins can assign product/category view permission to user or client roles');
                }
            }

            $role->permissions()->sync($request->permissions);
        }
        return redirect()->route('roles.index')->with('success', 'Role created');
    }

    public function edit(Role $role)
    {
        $this->authorize('update', $role);
        $permissions = Permission::all();
    /** @var User|null $user */
    $user = Auth::user();
    $canAssignRestricted = $user && $user->hasRole('admin');

        return Inertia::render('Roles/Edit', [
            'role' => $role->load('permissions'),
            'permissions' => $permissions,
            'canAssignRestricted' => $canAssignRestricted,
        ]);
    }

    public function update(Request $request, Role $role)
    {
        $this->authorize('update', $role);
        $request->validate(['name' => 'required|string|unique:roles,name,' . $role->id]);
        $role->update(['name' => $request->name]);
        // Prevent non-admins from assigning/removing product/category view permissions on 'user' or 'client' roles
        $requestedPermissions = $request->permissions ?? [];
        $restricted = ['product.view', 'category.view'];
        $roleName = strtolower($role->name);
        $permissionNames = Permission::whereIn('id', $requestedPermissions)->pluck('name')->toArray();

        /** @var User|null $user */
        $user = Auth::user();

        $allowed = $user && (
            ($user->type ?? null) === 'admin' ||
            (method_exists($user, 'hasRole') && $user->hasRole('admin')) ||
            (method_exists($user, 'can') && $user->can('permission.manage'))
        );

        if (in_array($roleName, ['user', 'client']) && !$allowed) {
            if (count(array_intersect($restricted, $permissionNames)) > 0) {
                abort(403, 'Only admins can assign product/category view permission to user or client roles');
            }
        }

        $role->permissions()->sync($requestedPermissions);
        return Inertia::location(route('roles.index'));
    }

    public function destroy(Role $role)
    {
        $this->authorize('delete', $role);
        $role->delete();
        return redirect()->back()->with('success', 'Role deleted');
    }
}