<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    public function before(User $user): ?bool
    {
        // l'Admin a un accès total
        if ($user->hasRole('admin')) {
            return true;
        }

        return null;
    }

    public function viewAny(User $user): bool
    {
        return $user->hasRole('client');
    }

    public function view(User $user, User $model): bool
    {
        // Un utilisateur peut toujours se voir lui-même
        if ($user->id === $model->id) {
            return true;
        }

        // le Client peut voir users & clients (pas admins)
        if ($user->hasRole('client')) {
            return !$model->hasRole('admin');
        }

        return false;
    }

    public function create(User $user): bool
    {
        return $user->hasRole('client');
    }

    public function update(User $user, User $model): bool
    {
        // Le Client ne touche jamais aux admins
        if ($model->hasRole('admin')) {
            return false;
        }

        // Le Client peut modifier users & clients
        if ($user->hasRole('client')) {
            return true;
        }

        // Self-update
        return $user->id === $model->id;
    }

    public function delete(User $user, User $model): bool
    {
        // le Client ne peut jamais supprimer un admin
        if ($model->hasRole('admin')) {
            return false;
        }

        return $user->hasRole('client');
    }
}
