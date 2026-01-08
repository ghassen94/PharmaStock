<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create permissions
        $permissions = [
            'product.create', 'product.view', 'product.edit', 'product.delete',
            'category.create', 'category.view', 'category.edit', 'category.delete',
            'user.manage', 'role.manage', 'permission.manage'
        ];

        foreach ($permissions as $perm) {
            \App\Models\Permission::firstOrCreate(['name' => $perm]);
        }

        // Create roles
        $adminRole = \App\Models\Role::firstOrCreate(['name' => 'admin']);
        $userRole = \App\Models\Role::firstOrCreate(['name' => 'user_manager']);
        $clientRole = \App\Models\Role::firstOrCreate(['name' => 'client']);

        // Assign permissions to roles
        $adminRole->permissions()->sync(\App\Models\Permission::pluck('id')->toArray());
        $userRole->permissions()->sync(\App\Models\Permission::whereIn('name', ['product.create','product.view','product.edit','category.view','category.create','category.edit'])->pluck('id')->toArray());

        // Create users
        $admin = User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@test.com',
            'type' => 'admin',
            'password' => bcrypt('password'),
        ]);
        $client = User::factory()->create([
            'name' => 'Client',
            'email' => 'client@test.com',
            'type' => 'client',
            'password' => bcrypt('password'),
        ]);
        $user = User::factory()->create([
            'name' => 'User',
            'email' => 'user@test.com',
            'type' => 'user',
            'password' => bcrypt('password'),
        ]);

        // Assign roles
        $admin->assignRole('admin');
        $client->assignRole('client');
        $user->assignRole('user_manager');

        // Create sample categories & products
        $cat1 = \App\Models\Category::create(['name' => 'Analgesics']);
        $cat2 = \App\Models\Category::create(['name' => 'Antibiotics']);

        \App\Models\Product::create(['name' => 'Paracetamol', 'price' => 5.99, 'stock' => 100, 'category_id' => $cat1->id]);
        \App\Models\Product::create(['name' => 'Amoxicillin', 'price' => 12.50, 'stock' => 50, 'category_id' => $cat2->id]);
    }
}
