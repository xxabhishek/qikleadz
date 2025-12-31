<?php

// namespace App\Models;

// use Illuminate\Database\Eloquent\Model;
// use Illuminate\Database\Eloquent\SoftDeletes;

// class Lead extends Model
// {
//     // use SoftDeletes;

//     protected $fillable = [
//         'customer_name',
//         'phone_no',
//         'state',
//         'city',
//         'location',
//         'vehicle_usage_id',
//         'vehicle_segment_id',
//         'brand_id',
//         'variant_id',
//         'fuel_type_id',
//         'vehicle_config_id',
//         'executive_id',
//         'distributor_id',
//         'dealer_id',
//         'country_id',
//         'oem_id',
//         'tentative_purchase_date',
//         'lead_weightage',
//         'vehicle_qty',
//         'payment_mode',
//         'additional_note',
//         'status',
//         'city_id',
//         'area_id',
//     ];

//     public function vehicles()
//     {
//         return $this->hasMany(LeadVehicle::class, 'lead_id');
//     }

//     protected $dates = ['tentative_purchase_date', 'created_at', 'updated_at', 'deleted_at'];

//     public function leadDetails()
//     {
//         return $this->hasMany(LeadDetail::class, 'lead_id');
//     }
//     public function details()
//     {
//         return $this->hasMany(LeadDetail::class, 'lead_id');
//     }
//     public function lead_details()
//     {
//         return $this->hasMany(LeadDetail::class);
//     }

//     public function dealer()
//     {
//         return $this->belongsTo(User::class, 'dealer_id');
//     }

//     public function distributor()
//     {
//         return $this->belongsTo(User::class, 'distributor_id');
//     }

//     // In Lead model
//     public function getLatestFollowUpDateAttribute()
//     {
//         return $this->followUpHistory()
//             ->orderBy('follow_up_date', 'desc')
//             ->value('follow_up_date');
//     }
// }





namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Lead extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [

        'customer_name',
        'phone_no',
        'state',
        'city',
        'location',
        'vehicle_usage_id',
        'vehicle_segment_id',
        'brand_id',
        'variant_id',
        'fuel_type_id',
        'vehicle_config_id',
        'executive_id',
        'distributor_id',
        'dealer_id',
        'country_id',
        'oem_id',
        'tentative_purchase_date',
        'lead_weightage',
        'vehicle_qty',
        'payment_mode',
        'additional_note',
        'status',
        'city_id',
        'area_id',
        'verification_status',
        'verification_note',
        'verified_by',
        'verified_at',
    ];

    protected $dates = [
        'tentative_purchase_date',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    // Relationship with dealer (user)
    public function dealer()
    {
        return $this->belongsTo(User::class, 'dealer_id');
    }

    // Relationship with distributor (user)
    public function distributor()
    {
        return $this->belongsTo(User::class, 'distributor_id');
    }

    // Relationship with executive (user)
    public function executive()
    {
        return $this->belongsTo(User::class, 'executive_id');
    }

    // Relationship with OEM (if you have OEM model)
    public function oem()
    {
        return $this->belongsTo(Oem::class, 'oem_id');
    }

    // Relationship with City (if you have City model)
    public function city()
    {
        return $this->belongsTo(City::class, 'city_id');
    }

    // Scope for distributor leads
    public function scopeForDistributor($query, $distributorId)
    {
        return $query->where('distributor_id', $distributorId);
    }

    // Scope for dealer leads
    public function scopeForDealer($query, $dealerId)
    {
        return $query->where('dealer_id', $dealerId);
    }

    public function leadDetails()
    {
        return $this->hasMany(LeadDetail::class, 'lead_id');
    }
    public function details()
    {
        return $this->hasMany(LeadDetail::class, 'lead_id');
    }
    public function lead_details()
    {
        return $this->hasMany(LeadDetail::class);
    }

    public function claim()
    {
        return $this->hasOne(Claim::class);
    }

    const VERIFICATION_PENDING = 'pending';
    const VERIFICATION_SUCCESSFUL = 'successful';
    const VERIFICATION_DISPUTED = 'disputed';
    const VERIFICATION_REJECTED = 'rejected';

    public function verifier()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function scopePendingVerification($query)
    {
        return $query->where('status', 'converted')
            ->where('verification_status', self::VERIFICATION_PENDING);
    }

    public function scopeVerifiedSuccessful($query)
    {
        return $query->where('status', 'converted')
            ->where('verification_status', self::VERIFICATION_SUCCESSFUL);
    }

    public static function generateLeadNo(): string
    {
        $lastLead = self::orderBy('id', 'desc')->first();

        if (!$lastLead || !preg_match('/LAA(\d{4})/', $lastLead->lead_no ?? '', $matches)) {
            $nextNumber = 1;
        } else {
            $nextNumber = (int) $matches[1] + 1;
        }

        return 'LAA' . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
    }
}
