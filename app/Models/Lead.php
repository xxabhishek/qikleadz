<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Lead extends Model
{
    use SoftDeletes;

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
    ];

    public function vehicles()
    {
        return $this->hasMany(LeadVehicle::class, 'lead_id');
    }

    protected $dates = ['tentative_purchase_date', 'created_at', 'updated_at', 'deleted_at'];

    public function leadDetails()
    {
        return $this->hasMany(LeadDetail::class,'lead_id');
    }
    public function details()
    {
        return $this->hasMany(LeadDetail::class,'lead_id');
    }
}