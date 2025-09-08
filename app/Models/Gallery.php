<?php

namespace App\Models;

use Faker\Core\Color;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Gallery extends Model
{
    use HasFactory;
    protected $table = "galleries";
    protected $fillable = ['cover_photo','brand_id','variant_id','color_id','fuel_type_id'];


    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }
    public function variant()
    {
        return $this->belongsTo(Variant::class);
    }
    public function color()
    {
        return $this->belongsTo(Color::class);
    }
    public function fuelType()
    {
        return $this->belongsTo(FuelType::class);
    }

}
