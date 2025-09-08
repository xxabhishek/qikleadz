<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VehicleSegment extends Model
{
    use HasFactory;
    protected $table = "vehicle_segment";
    protected $fillable = ['name', 'country_id'];
    public function country()
    {
        return $this->belongsTo(Country::class, 'country_id');
    }


}