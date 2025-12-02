<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class ResetUserPins extends Command
{
    protected $signature = 'users:reset-pins';
    protected $description = 'Reset PINs for all users to 1234';

    public function handle()
    {
        $users = User::where('pin', '0')->orWhereNull('pin')->get();

        foreach ($users as $user) {
            $user->pin = Hash::make('1234');
            $user->save();
            $this->info("Reset PIN for: {$user->email}");
        }

        $this->info("PIN reset completed for {$users->count()} users.");
        return 0;
    }
}
