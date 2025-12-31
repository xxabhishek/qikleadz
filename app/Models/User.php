<?php

// namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Foundation\Auth\User as Authenticatable;
// use Illuminate\Notifications\Notifiable;
// use Laravel\Sanctum\HasApiTokens;
// use Spatie\Permission\Traits\HasRoles;

// class User extends Authenticatable
// {
//     use HasFactory, Notifiable, HasRoles, HasApiTokens;

//     protected $fillable = [
//         'user_id',
//         'user_code',
//         'name',
//         'email',
//         'pin',
//         'role',
//         'parent_id',
//         'mobile',
//         'address',
//         'country_id',
//         'status',
//         'logo'
//     ];

//     protected $hidden = [
//         'pin',
//         'remember_token',
//     ];


//     protected $casts = [
//         'email_verified_at' => 'datetime',
//     ];

//     // Generate random user ID (A1234 format)
//     public static function generateUserId()
//     {
//         do {
//             $char = chr(rand(65, 90)); // Random uppercase letter A-Z
//             $numbers = str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);
//             $userId = $char . $numbers;
//         } while (self::where('user_id', $userId)->exists());

//         return $userId;
//     }

//     public function roleData()
//     {
//         return $this->belongsTo(Role::class, 'role', 'id');
//     }

//     public function parent()
//     {
//         return $this->belongsTo(User::class, 'parent_id');
//     }
//     public function getAuthPassword()
//     {
//         return $this->pin;
//     }

//     public function getEmailForPasswordReset()
//     {
//         return $this->email;
//     }

//     public function distributorLeads()
//     {
//         return $this->hasMany(Lead::class, 'distributor_id');
//     }

//     // Relationship with leads as dealer
//     public function dealerLeads()
//     {
//         return $this->hasMany(Lead::class, 'dealer_id');
//     }

//     // Get all leads based on role
//     public function getAssignedLeads()
//     {
//         if ($this->hasRole('Distributor')) {
//             return $this->distributorLeads()->with(['oem', 'city', 'executive'])->get();
//         } elseif ($this->hasRole('Dealer')) {
//             return $this->dealerLeads()->with(['oem', 'city', 'executive'])->get();
//         }

//         return collect();
//     }

//     // Check if user is distributor
//     public function isDistributor()
//     {
//         return $this->hasRole('Distributor');
//     }

//     // Check if user is dealer
//     public function isDealer()
//     {
//         return $this->hasRole('Dealer');
//     }
// }





namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use App\Traits\HasRoleTrait;
use Laravel\Sanctum\HasApiTokens;


class User extends Authenticatable
{
    use HasFactory, Notifiable, HasRoles, HasRoleTrait, HasApiTokens;

    protected $fillable = [
        'user_id',
        'user_code',
        'name',
        'email',
        'email_verified_at',
        'pin',
        'role',
        'parent_id',
        'mobile',
        'address',
        'country_id',
        'status',
        'logo',
        'remember_token',
        'executive_id',
        'distributor_id'
    ];

    protected $hidden = [
        'pin',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    // // Relationship: Leads where this user is the distributor
    // public function distributorLeads()
    // {
    //     return $this->hasMany(Lead::class, 'distributor_id');
    // }

    public function distributorLeads()
    {
        return $this->hasMany(Lead::class, 'distributor_id');
    }

    // Relationship: Leads where this user is the dealer
    public function dealerLeads()
    {
        return $this->hasMany(Lead::class, 'dealer_id');
    }

    // Relationship: Leads assigned to this executive
    public function executiveLeads()
    {
        return $this->hasMany(Lead::class, 'executive_id');
    }

    // Relationship: Dealers under this distributor
    public function dealers()
    {
        return $this->hasMany(User::class, 'parent_id')
            ->whereHas('roles', function ($query) {
                $query->where('name', 'Dealer');
            });
    }

    // Relationship: Distributor of this dealer
    // public function distributor()
    // {
    //     return $this->belongsTo(User::class, 'parent_id');
    // }


    // Get all leads based on role
    // public function getAssignedLeads()
    // {
    //     if ($this->hasRole('Distributor')) {
    //         return $this->distributorLeads()->with(['oem', 'city', 'executive'])->get();
    //     } elseif ($this->hasRole('Dealer')) {
    //         return $this->dealerLeads()->with(['oem', 'city', 'executive', 'distributor'])->get();
    //     }

    //     return collect();
    // }

    public function assignedLeads()
    {
        return $this->hasMany(Lead::class, 'dealer_id');
    }

    // Check if user is distributor
    public function isDistributor()
    {
        return $this->hasRole('Distributor');
    }

    // Check if user is dealer
    public function isDealer()
    {
        return $this->hasRole('Dealer');
    }

    // Check if user is executive
    public function isExecutive()
    {
        return $this->hasRole('Executive');
    }

    // Generate user ID
    public static function generateUserId()
    {
        $lastUser = self::orderBy('id', 'desc')->first();
        $nextId = $lastUser ? $lastUser->id + 1 : 1;
        return 'USR' . str_pad($nextId, 6, '0', STR_PAD_LEFT);
    }
}
