<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Brand extends Model
{
    use SoftDeletes;
    /**
     * Brand table
     *
     * @var string
     */
    protected $table = 'brands';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id',
        'name',
        'vehicle_usage_id',
        'vehicle_segment_id',
        'country_id',
        'oem_id'
    ];

    public function vehicleUsage()
    {
        return $this->belongsTo(VehicleUsage::class, 'vehicle_usage_id');
    }

    /**
     * Relation with VehicleType
     */
    public function vehicleSegment()
    {
        return $this->belongsTo(VehicleSegment::class, 'vehicle_segment_id');
    }

    /**
     * Relation with Country
     */
    public function country()
    {
        return $this->belongsTo(Country::class, 'country_id');
    }

    // app/Models/Brand.php
    public function oem()
    {
        return $this->belongsTo(\App\Models\OEM::class, 'oem_id', 'id');
    }






}