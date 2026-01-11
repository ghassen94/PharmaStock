<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Product;
use Illuminate\Auth\Access\HandlesAuthorization;

class ProductPolicy
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
        // Use hasPermission directly to check role-based permissions
        return $user->hasPermission('product.view');
    }

    public function view(User $user, Product $product): bool
    {
        return $user->hasPermission('product.view');
    }

    public function create(User $user): bool
    {
        return $user->can('product.create');
    }

    public function update(User $user, Product $product): bool
    {
        return $user->can('product.edit');
    }

    public function delete(User $user, Product $product): bool
    {
        return $user->can('product.delete');
    }
}
