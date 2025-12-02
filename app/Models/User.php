<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasRoles, HasApiTokens;

    protected $fillable = [
        'user_id',
        'user_code',
        'name',
        'email',
        'pin',
        'role',
        'parent_id',
        'mobile',
        'address',
        'country_id',
        'status',
        'logo'
    ];

    protected $hidden = [
        'pin',
        'remember_token',
    ];


    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    // Generate random user ID (A1234 format)
    public static function generateUserId()
    {
        do {
            $char = chr(rand(65, 90)); // Random uppercase letter A-Z
            $numbers = str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);
            $userId = $char . $numbers;
        } while (self::where('user_id', $userId)->exists());

        return $userId;
    }

    public function roleData()
    {
        return $this->belongsTo(Role::class, 'role', 'id');
    }

    public function parent()
    {
        return $this->belongsTo(User::class, 'parent_id');
    }
    public function getAuthPassword()
    {
        return $this->pin;
    }

    public function getEmailForPasswordReset()
    {
        return $this->email;
    }

}