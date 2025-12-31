<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        // Check if admin already exists
        $existingAdmin = User::where('email', 'admin1@gmail.com')->first();

        if ($existingAdmin) {
            $this->command->info('Admin user already exists. Updating credentials...');

            // Update existing admin
            $existingAdmin->update([
                'pin' => Hash::make('1234'),
                'password' => Hash::make('admin@123'),
                'status' => 'Active',
                'role' => 1, // Admin role
            ]);

            $this->command->info('Admin credentials updated successfully!');
        } else {
            // Create new admin user
            $admin = User::create([
                'name' => 'GSS - Administrator',
                'email' => 'admin1@gmail.com',
                'user_id' => 'A8767',
                'pin' => Hash::make('1234'),
                'password' => Hash::make('admin@123'),
                'status' => 'Active',
                'role' => 1, // Admin role
                'email_verified_at' => now(),
                'remember_token' => Str::random(10),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $this->command->info('Admin user created successfully!');
        }

        // Display login credentials
        $this->command->line('');
        $this->command->info('═══════════════════════════════════════════════════');
        $this->command->info('            ADMIN LOGIN CREDENTIALS                ');
        $this->command->info('═══════════════════════════════════════════════════');
        $this->command->info('Email: admin1@gmail.com');
        $this->command->info('User ID: A8767');
        $this->command->info('PIN: 1234');
        $this->command->info('Password: admin@123');
        $this->command->info('Role: Admin (1)');
        $this->command->info('═══════════════════════════════════════════════════');
    }
}
