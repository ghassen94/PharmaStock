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

        return Inertia::render('Users/Index', [
            'users' => User::with('roles')->get(),
            'roles' => Role::all(),
        ]);
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

        if (
            auth()->user()->hasRole('client') &&
            $data['type'] === 'admin'
        ) {
            abort(403, 'Clients cannot create admins');
        }

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'type' => $data['type'],
        ]);

        if (!empty($data['roles'])) {
            $roleIds = is_string($data['roles'][0])
                ? Role::whereIn('name', $data['roles'])->pluck('id')->toArray()
                : $data['roles'];

            $user->roles()->sync($roleIds);
        }

        return redirect()
            ->route('users.index')
            ->with('success', 'User created successfully');
    }

    public function edit(User $user)
    {
        if (
            $user->hasRole('admin') &&
            auth()->user()->hasRole('client')
        ) {
            abort(403);
        }

        $this->authorize('update', $user);

        return Inertia::render('Users/Edit', [
            'user' => $user->load('roles'),
            'roles' => Role::all(),
        ]);
    }

    public function update(Request $request, User $user)
    {
        if (
            $user->hasRole('admin') &&
            auth()->user()->hasRole('client')
        ) {
            abort(403, 'Clients cannot update admins');
        }

        $this->authorize('update', $user);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:6',
            'type' => 'required|in:admin,client,user',
            'roles' => 'array',
        ]);

        if (
            auth()->user()->hasRole('client') &&
            $data['type'] === 'admin'
        ) {
            abort(403, 'Clients cannot assign admin role');
        }

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

        return redirect()->route('users.index');
    }

    public function destroy(User $user)
    {
        if (
            $user->hasRole('admin') &&
            !auth()->user()->hasRole('admin')
        ) {
            abort(403, 'Only admins can delete admins');
        }

        $this->authorize('delete', $user);

        $user->delete();

        return redirect()
            ->back()
            ->with('success', 'User deleted');
    }
}
