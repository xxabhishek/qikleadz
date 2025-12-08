<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Currency extends Model
{
    use HasFactory;
    protected $table = 'currency';
    protected $fillable = [
        'country_id',
        'currency',
        'symbol'
    ];

    public function country()
    {
        return $this->belongsTo(Country::class, 'country_id');
    }
}
