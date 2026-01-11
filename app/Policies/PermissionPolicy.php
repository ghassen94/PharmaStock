<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Permission;
use Illuminate\Auth\Access\HandlesAuthorization;

class PermissionPolicy
{
    use HandlesAuthorization;

    public function before(User $user): ?bool
    {
        // Admin = accès total
        if ($user->hasRole('admin')) {
            return true;
        }

        return null;
    }

    public function viewAny(User $user): bool
    {
        return $user->can('permission.manage');
    }

    public function view(User $user, Permission $permission): bool
    {
        return $user->can('permission.manage');
    }

    public function create(User $user): bool
    {
        return $user->can('permission.manage');
    }

    public function update(User $user, Permission $permission): bool
    {
        return $user->can('permission.manage');
    }

    public function delete(User $user, Permission $permission): bool
    {
        return $user->can('permission.manage');
    }
}
