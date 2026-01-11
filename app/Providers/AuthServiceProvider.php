<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\User;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // 'App\\Models\\Model' => 'App\\Policies\\ModelPolicy',
        'App\\Models\\User' => 'App\\Policies\\UserPolicy',
        'App\\Models\\Role' => 'App\\Policies\\RolePolicy',        
        'App\Models\Permission' => 'App\Policies\PermissionPolicy',    
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        Gate::before(function (User $user, $ability) {
            // Admins have all abilities
            if ($user->type === 'admin') {
                return true;
            }

            // If the user has a role that grants a permission matching the ability string,
            // allow it dynamically. This makes $user->can('product.view') work when the
            // permission is assigned to one of the user's roles.
            if (method_exists($user, 'hasPermission') && $user->hasPermission($ability)) {
                return true;
            }
        });

        // Generic permission gate: checks user's roles' permissions
        Gate::define('has-permission', function (User $user, $permission) {
            return $user->hasPermission($permission);
        });
    }
}
