<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model as BaseModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class VehicleConfig extends BaseModel
{
    use SoftDeletes;

    protected $table = 'vehicle_configs';

    protected $fillable = [
        'brand_id',
        'variant_id',
        'fuel_type_id',
        'country_id',
        'price'
    ];

    protected $dates = ['deleted_at'];

    public function model()
    {
        return $this->belongsTo(Brand::class, 'brand_id');
    }

    public function variant()
    {
        return $this->belongsTo(Variant::class, 'variant_id');
    }

    public function fuelType()
    {
        return $this->belongsTo(FuelType::class, 'fuel_type_id');
    }

    public function country()
    {
        return $this->belongsTo(Country::class, 'country_id');
    }
}
