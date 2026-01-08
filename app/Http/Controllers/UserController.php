<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', User::class);
        $users = User::with('roles')->get();
        $roles = Role::all();
        return Inertia::render('Users/Index', compact('users', 'roles'));
    }

    public function store(Request $request)
    {
        $this->authorize('create', User::class);
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'type' => 'required|in:admin,client,user',
            'roles' => 'array',
        ]);

        // Prevent clients from creating admin users
        if ($request->user()->hasRole('client') && ($data['type'] ?? null) === 'admin') {
            abort(403);
        }

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'type' => $data['type'],
        ]);

        if (!empty($data['roles'])) {
            // Roles may be provided as IDs or names; normalize to IDs
            $roles = $data['roles'];
            $roleIds = [];
            if (count($roles) && is_string($roles[0])) {
                $roleIds = \App\Models\Role::whereIn('name', $roles)->pluck('id')->toArray();
            } else {
                $roleIds = $roles;
            }
            $user->roles()->sync($roleIds);
        }

        return redirect()->back()->with('success', 'User created');
    }

    public function update(Request $request, User $user)
    {
        $this->authorize('update', $user);
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:6',
            'type' => 'sometimes|required|in:admin,client,user',
            'roles' => 'array',
        ]);

        // Prevent clients from promoting users to admin
        if ($request->user()->hasRole('client') && array_key_exists('type', $data) && ($data['type'] === 'admin')) {
            abort(403);
        }

        $user->update(array_filter([
            'name' => $data['name'] ?? null,
            'email' => $data['email'] ?? null,
            'type' => $data['type'] ?? null,
        ]));

        if (!empty($data['password'])) {
            $user->password = Hash::make($data['password']);
            $user->save();
        }

        if (array_key_exists('roles', $data)) {
            // Prevent clients from assigning admin role by id or name
            if ($request->user()->hasRole('client')) {
                $adminRole = \App\Models\Role::where('name', 'admin')->first();
                $roles = $data['roles'] ?? [];
                // Normalize names to ids if needed
                if (count($roles) && is_string($roles[0])) {
                    $roles = \App\Models\Role::whereIn('name', $roles)->pluck('id')->toArray();
                }
                if ($adminRole && in_array($adminRole->id, $roles)) {
                    abort(403);
                }
                $user->roles()->sync($roles);
            } else {
                $roles = $data['roles'] ?? [];
                if (count($roles) && is_string($roles[0])) {
                    $roles = \App\Models\Role::whereIn('name', $roles)->pluck('id')->toArray();
                }
                $user->roles()->sync($roles);
            }
        }

        return redirect()->back()->with('success', 'User updated');
    }

    public function destroy(User $user)
    {
        $this->authorize('delete', $user);
        $user->delete();
        return redirect()->back()->with('success', 'User deleted');
    }
}
