<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Category;
use Illuminate\Auth\Access\HandlesAuthorization;

class CategoryPolicy
{
    use HandlesAuthorization;

    /**
     * Admin = accès total
     */
    public function before(User $user): ?bool
    {
        if ($user->hasRole('admin')) {
            return true;
        }

        return null;
    }

    /**
     * Voir la liste des catégories
     */
    public function viewAny(User $user): bool
    {
        // Use hasPermission directly to check role-based permissions
        return $user->hasPermission('category.view');
    }

    /**
     * Voir une catégorie
     */
    public function view(User $user, Category $category): bool
    {
        return $user->hasPermission('category.view');
    }

    /**
     * Créer une catégorie
     */
    public function create(User $user): bool
    {
        return $user->can('category.create');
    }

    /**
     * Modifier une catégorie
     */
    public function update(User $user, Category $category): bool
    {
        return $user->can('category.edit');
    }

    /**
     * Supprimer une catégorie
     */
    public function delete(User $user, Category $category): bool
    {
        return $user->can('category.delete');
    }
}
