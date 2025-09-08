<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class State extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'country_id',
    ];

    /**
     * A State belongs to a Country
     */
    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    /**
     * A State has many Cities
     */
    public function cities()
    {
        return $this->hasMany(City::class);
    }
}
