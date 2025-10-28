<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LeadVehicle extends Model
{
    use SoftDeletes;
    protected $table = 'lead_vehicles'; // तुमचं table name

    protected $fillable = [
        'lead_id',
        'vehicle_usage_id',
        'vehicle_segment_id',
        'brand_id',
        'variant_id',
        'fuel_type_id',
        'vehicle_config_id',
        'country_id',
        'oem_id',
        'tentative_purchase_date',
        'vehicle_qty',
        'additional_note',
    ];

    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }

    // Example: adjust as per your other models
    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }
    public function variant()
    {
        return $this->belongsTo(Variant::class);
    }
    public function vehicleUsage()
    {
        return $this->belongsTo(VehicleUsage::class);
    }
    public function vehicleSegment()
    {
        return $this->belongsTo(VehicleSegment::class);
    }
    public function fuelType()
    {
        return $this->belongsTo(FuelType::class);
    }
    public function vehicleConfig()
    {
        return $this->belongsTo(VehicleConfig::class);
    }
    public function country()
    {
        return $this->belongsTo(Country::class);
    }
    public function oem()
    {
        return $this->belongsTo(Oem::class);
    }
}