<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasRole('client');
    }

    public function view(User $user, User $model): bool
    {
        // Les utilisateurs peuvent se voir eux-mêmes, ainsi que les clients/administrateurs, selon leur type.
        if ($user->id === $model->id) return true;
        if ($user->hasRole('admin')) return true;
        if ($user->hasRole('client') && $model->type !== 'admin') return true;
        return false;
    }

    public function create(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasRole('client');
    }

    public function update(User $user, User $model): bool
    {
        if ($user->hasRole('admin')) return true;
        if ($user->hasRole('client') && $model->type !== 'admin') return true;
        return $user->id === $model->id;
    }

    public function delete(User $user, User $model): bool
    {
        // Les administrateurs peuvent supprimer n'importe qui
        if ($user->hasRole('admin')) return true;

        // Les clients ne peuvent pas supprimer les administrateurs.
        if ($user->hasRole('client')) {
            return $model->type !== 'admin';
        }

        return false;
    }
}
