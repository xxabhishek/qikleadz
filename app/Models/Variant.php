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

    public function galleries()
    {
        return $this->hasMany(Gallery::class, 'variant_id', 'id');
    }
    public function brand()
    {
        return $this->belongsTo(Brand::class, 'brand_id');
    }

    public function variant()
    {
        return $this->belongsTo(Variant::class, 'variant_id');
    }

    public function country()
    {
        return $this->belongsTo(Country::class, 'country_id');
    }

    public function fuelType()
    {
        return $this->belongsTo(FuelType::class, 'fuel_type_id');
    }

    public function transmission()
    {
        return $this->belongsTo(Transmission::class, 'transmission_id');
    }

    public function cc()
    {
        return $this->belongsTo(cc::class, 'cc_id');
    }


    public function vehicleUsage()
    {
        return $this->belongsTo(VehicleUsage::class, 'vehicle_usage_id');
    }


    public function colorPrices()
    {
        return $this->hasMany(VariantColorPrice::class);
    }

    public function color()
    {
        return $this->belongsTo(Color::class, 'color_id', 'id');
    }
    // Helper method to get price for specific color
    public function getPriceForColor($colorId)
    {
        $colorPrice = $this->colorPrices()->where('color_id', $colorId)->first();
        return $colorPrice ? $colorPrice->price : $this->basic_price;
    }

    // Get all available colors with prices
    public function getColorsWithPrices()
    {
        $colorsWithPrices = [];

        if ($this->colorPrices->count() > 0) {
            foreach ($this->colorPrices as $colorPrice) {
                $tax = (int) ($colorPrice->tax ?? 0);
                $other = (int) ($colorPrice->other ?? 0);
                $totalPrice = (int) $colorPrice->price;

                $colorsWithPrices[] = [
                    'id' => $colorPrice->color->id,
                    'name' => $colorPrice->color->name,
                    'color_code' => $colorPrice->color->color_code,
                    'price' => $totalPrice,
                    'tax' => $tax,
                    'other' => $other,
                    'base_price' => $totalPrice - $tax - $other,
                    'has_custom_price' => true
                ];
            }
        } else {
            $colorIds = array_filter(explode(',', $this->color_id ?? ''));
            $colors = Color::whereIn('id', $colorIds)->get();

            foreach ($colors as $color) {
                $totalPrice = (int) $this->basic_price;

                $colorsWithPrices[] = [
                    'id' => $color->id,
                    'name' => $color->name,
                    'color_code' => $color->color_code,
                    'price' => $totalPrice,
                    'tax' => 0,
                    'other' => 0,
                    'base_price' => $totalPrice,
                    'has_custom_price' => false
                ];
            }
        }

        return $colorsWithPrices;
    }



    // //
// // Always return color_id as an array
//     public function getColorIdArrayAttribute()
//     {
//         if (empty($this->color_id)) {
//             return [];
//         }

    //         return explode(',', $this->color_id);
//     }

    //     // When setting color_id, allow array and convert to string
//     public function setColorIdAttribute($value)
//     {
//         if (is_array($value)) {
//             $this->attributes['color_id'] = implode(',', $value);
//         } else {
//             $this->attributes['color_id'] = $value;
//         }
//     }


}
