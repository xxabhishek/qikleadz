<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VariantColorPrice extends Model
{
    use HasFactory;
    protected $fillable = [
        'variant_id',
        'color_id',
        'price'
    ];

    public function color()
    {
        return $this->belongsTo(Color::class);
    }

    public function variant()
    {
        return $this->belongsTo(Variant::class);
    }
}
