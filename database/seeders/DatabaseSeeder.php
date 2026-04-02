<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin user
        User::create([
            'name'     => 'Admin User',
            'email'    => 'admin@greenpark.com',
            'phone'    => '0700000001',
            'password' => Hash::make('password'),
            'role'     => 'admin',
        ]);

        // Guard user
        User::create([
            'name'     => 'John Guard',
            'email'    => 'guard@greenpark.com',
            'phone'    => '0700000002',
            'password' => Hash::make('password'),
            'role'     => 'guard',
            'badge'    => 'G001',
            'shift'    => 'Day (6am-6pm)',
        ]);

        // Tenant user
        User::create([
            'name'     => 'Jane Tenant',
            'email'    => 'tenant@greenpark.com',
            'phone'    => '0700000003',
            'password' => Hash::make('password'),
            'role'     => 'tenant',
            'unit'     => 'B4',
            'block'    => 'B',
            'approved' => true,
        ]);
    }
}
