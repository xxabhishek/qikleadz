<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Variant extends Model
{
   
    /**
     * Brand table
     *
     * @var string
     */
    protected $table = 'variants';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id',
        'name',
        'brand_id',
        'fuel_type_id',
        'transmission_id',
        'color_id',
        'cc_id',
        'vehicle_usage_id',
        'basic_price',
        'country_id',
        'commission',
        'brochure'


    ];


    public function brand()
    {
        return $this->belongsTo(Brand::class, 'brand_id');
    }

        public function variant()
    {
        return $this->belongsTo(Variant::class , 'variant_id');
    }

    public function country()
    {
        return $this->belongsTo(Country::class , 'country_id');
    }

        public function fuelType()
    {
        return $this->belongsTo(FuelType::class , 'fuel_type_id');
    }

            public function transmission()
    {
        return $this->belongsTo(Transmission::class , 'transmission_id');
    }

        public function cc()
    {
        return $this->belongsTo(cc::class , 'cc_id');
    }


            public function vehicleUsage()
    {
        return $this->belongsTo(VehicleUsage::class , 'vehicle_usage_id');
    }







// Always return color_id as an array
    public function getColorIdArrayAttribute()
    {
        if (empty($this->color_id)) {
            return [];
        }

        return explode(',', $this->color_id);
    }

    // When setting color_id, allow array and convert to string
    public function setColorIdAttribute($value)
    {
        if (is_array($value)) {
            $this->attributes['color_id'] = implode(',', $value);
        } else {
            $this->attributes['color_id'] = $value;
        }
    }


}