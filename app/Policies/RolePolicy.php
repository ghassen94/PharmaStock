<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Role;
use Illuminate\Auth\Access\HandlesAuthorization;

class RolePolicy
{
    use HandlesAuthorization;

    public function before(User $user): ?bool
    {
        if ($user->hasRole('admin')) {
            return true;
        }

        return null;
    }

    public function viewAny(User $user): bool
    {
        return $user->can('role.manage');
    }

    public function view(User $user, Role $role): bool
    {
        return $user->can('role.manage');
    }

    public function create(User $user): bool
    {
        return $user->can('role.manage');
    }

    public function update(User $user, Role $role): bool
    {
        return $user->can('role.manage');
    }

    public function delete(User $user, Role $role): bool
    {
        return $user->can('role.manage');
    }
}
