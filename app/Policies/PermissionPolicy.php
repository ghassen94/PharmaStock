<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Permission;
use Illuminate\Auth\Access\HandlesAuthorization;

class PermissionPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasPermission('permission.manage');
    }

    public function view(User $user, Permission $permission): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasPermission('permission.manage');
    }

    public function update(User $user, Permission $permission): bool
    {
        return $this->create($user);
    }

    public function delete(User $user, Permission $permission): bool
    {
        return $this->create($user);
    }
}
