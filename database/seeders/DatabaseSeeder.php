<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        /*
        |--------------------------------------------------------------------------
        | Permissions
        |--------------------------------------------------------------------------
        */
        $permissions = [
            // User management
            'admin.manage',
            'user.manage',
            'client.manage',

            // Products
            'product.create',
            'product.view',
            'product.edit',
            'product.delete',

            // Categories
            'category.create',
            'category.view',
            'category.edit',
            'category.delete',

            // Roles & permissions
            'role.manage',
            'permission.manage',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        $adminRole  = Role::firstOrCreate(['name' => 'admin']);
        $clientRole = Role::firstOrCreate(['name' => 'client']);
        $userRole   = Role::firstOrCreate(['name' => 'user']);

        // Assign permissions to roles
        
        $adminRole->permissions()->sync(
            Permission::pluck('id')->toArray()
        );

        $clientRole->permissions()->sync(
            Permission::whereIn('name', [
                'user.manage',
                'client.manage',
                'product.view',
                'category.view',
            ])->pluck('id')->toArray()
        );

        $userRole->permissions()->sync(
            Permission::whereIn('name', [
                'product.view',
                'category.view',
            ])->pluck('id')->toArray()
        );

        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@test.com',
            'password' => Hash::make('password'),
            'type' => 'admin',
        ]);

        $client = User::create([
            'name' => 'Client',
            'email' => 'client@test.com',
            'password' => Hash::make('password'),
            'type' => 'client',
        ]);

        $user = User::create([
            'name' => 'User',
            'email' => 'user@test.com',
            'password' => Hash::make('password'),
            'type' => 'user',
        ]);

        $admin->assignRole('admin');
        $client->assignRole('client');
        $user->assignRole('user');

        $analgesics = Category::create([
            'name' => 'Analgesics',
        ]);

        $antibiotics = Category::create([
            'name' => 'Antibiotics',
        ]);

        // Analgesics (3)
        Product::create([
            'name' => 'Paracetamol 500mg',
            'price' => 4.50,
            'stock' => 150,
            'category_id' => $analgesics->id,
        ]);

        Product::create([
            'name' => 'Ibuprofen 400mg',
            'price' => 6.20,
            'stock' => 120,
            'category_id' => $analgesics->id,
        ]);

        Product::create([
            'name' => 'Aspirin 500mg',
            'price' => 5.10,
            'stock' => 90,
            'category_id' => $analgesics->id,
        ]);

        // Antibiotics (3)
        Product::create([
            'name' => 'Amoxicillin 500mg',
            'price' => 12.50,
            'stock' => 80,
            'category_id' => $antibiotics->id,
        ]);

        Product::create([
            'name' => 'Azithromycin 250mg',
            'price' => 18.90,
            'stock' => 60,
            'category_id' => $antibiotics->id,
        ]);

        Product::create([
            'name' => 'Ciprofloxacin 500mg',
            'price' => 15.75,
            'stock' => 70,
            'category_id' => $antibiotics->id,
        ]);
    }
}
