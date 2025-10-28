<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Country extends Model
{
    use SoftDeletes;
    /**
     * Brand table
     *
     * @var string
     */
    protected $table = 'countries';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id',
        'name'


    ];


    public function states()
    {
        return $this->hasMany(State::class);
    }


    public function cities()
    {
        return $this->hasMany(City::class);
    }


 public function areas(): HasMany
    {
        return $this->hasMany(Area::class);
    }

}
