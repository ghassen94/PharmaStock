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
        'App\\Models\\Role' => 'App\\Policies\\RolePolicy',        'App\Models\Permission' => 'App\Policies\PermissionPolicy',    ];

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
        });

        // Generic permission gate: checks user's roles' permissions
        Gate::define('has-permission', function (User $user, $permission) {
            return $user->hasPermission($permission);
        });
    }
}
