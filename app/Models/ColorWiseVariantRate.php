<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ColorWiseVariantRate extends Model
{
    use SoftDeletes;
    /**
     * Brand table
     *
     * @var string
     */
    protected $table = 'variant_color_prices';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id',
        'country_id',
        'brand_id',
        'variant_id',
        'color_id',
        'price',
        'tax',
        'other',
        // 'commssion'
    ];


    // Variant Relation

    public function country()
    {
        return $this->belongsTo(Country::class, 'country_id');
    }

    public function variant()
    {
        return $this->belongsTo(Variant::class, 'variant_id');
    }

    // Color Relation
    public function color()
    {
        return $this->belongsTo(Color::class, 'color_id');
    }



}
