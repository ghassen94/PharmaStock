<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            // Share the current user's roles and permissions (names) so the frontend can
            // show/hide UI elements without extra requests.
            'abilities' => function () use ($request) {
                $user = $request->user();
                if (! $user) {
                    return [];
                }

                $roles = $user->roles()->pluck('name')->toArray();

                $permissions = $user->roles()->with('permissions')
                    ->get()
                    ->flatMap(function ($r) {
                        return $r->permissions->pluck('name');
                    })->unique()->values()->toArray();

                return [
                    'roles' => $roles,
                    'permissions' => $permissions,
                ];
            },
        ];
    }
}
