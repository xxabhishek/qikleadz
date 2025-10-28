<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Feature extends Model
{
    use SoftDeletes;
    /**
     * features table
     *
     * @var string
     */
    protected $table = 'features';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id',
        'brand_id',
        'variant_id',
        'title',
        'description'


    ];


    public function brand()
    {
        return $this->belongsTo(Brand::class, 'brand_id');
    }

    public function variant()
    {
        return $this->belongsTo(Variant::class , 'variant_id');
    }


}
