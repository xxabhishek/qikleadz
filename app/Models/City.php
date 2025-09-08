<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'state_id',
        'country_id',
    ];

    /**
     * A City belongs to a State
     */
    public function state()
    {
        return $this->belongsTo(State::class);
    }

    /**
     * A City belongs to a Country
     */
    public function country()
    {
        return $this->belongsTo(Country::class);
    }
}
