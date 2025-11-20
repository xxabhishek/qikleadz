<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Gallery extends Model
{
    use HasFactory;
    protected $table = "galleries";
    protected $fillable = [
        'cover_photos',
        'upload_videos',
        'brand_id',
        'variant_id',
        'color_id',
        'fuel_type_id',
    ];

    // In your Gallery model
    protected $casts = [
        'cover_photos' => 'array',
        'upload_videos' => 'array',
    ];





    public function brand()
    {
        return $this->belongsTo(Brand::class, 'brand_id');
    }

    public function variant()
    {
        return $this->belongsTo(Variant::class, 'variant_id');
    }

    public function color()
    {
        return $this->belongsTo(Color::class, 'color_id');
    }


    public function fuelType()
    {
        return $this->belongsTo(FuelType::class);
    }


    public function leadDetails()
    {
        return $this->hasMany(LeadDetail::class, 'variant_id', 'variant_id');
    }


}
