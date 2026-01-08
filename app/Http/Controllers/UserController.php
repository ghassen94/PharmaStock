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

    public function create()
    {
        $this->authorize('create', User::class);
        return Inertia::render('Users/Create', [
            'roles' => Role::all(),
        ]);
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

        // Empêcher les clients de créer des utilisateurs administrateurs
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
            // Les rôles peuvent être fournis sous forme d'identifiants ou de noms ; normaliser en identifiants
            $roles = $data['roles'];
            $roleIds = [];
            if (count($roles) && is_string($roles[0])) {
                $roleIds = \App\Models\Role::whereIn('name', $roles)->pluck('id')->toArray();
            } else {
                $roleIds = $roles;
            }
            $user->roles()->sync($roleIds);
        }
        return redirect()
            ->route('users.index')
            ->with('success', 'User created successfully');

    }

    public function edit(User $user)
    {
        $this->authorize('update', $user);

        return Inertia::render('Users/Edit', [
            'user' => $user->load('roles'),
            'roles' => Role::all(),
        ]);
    }

    public function update(Request $request, User $user)
    {
        $this->authorize('update', $user);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:6',
            'type' => 'required|in:admin,client,user',
            'roles' => 'array',
        ]);

        $user->update([
            'name' => $data['name'],
            'email' => $data['email'],
            'type' => $data['type'],
        ]);

        if (!empty($data['password'])) {
            $user->update([
                'password' => Hash::make($data['password']),
            ]);
        }

        if (isset($data['roles'])) {
            $user->roles()->sync($data['roles']);
        }

        return Inertia::location(route('users.index'));
    }


    public function destroy(User $user)
    {
        $this->authorize('delete', $user);
        $user->delete();
        return redirect()->back()->with('success', 'User deleted');
    }
}
