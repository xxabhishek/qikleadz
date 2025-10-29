<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DealerAreaMap extends Model
{
    use SoftDeletes;
    /**
     * Brand table
     *
     * @var string
     */
    protected $table = 'dealer_area_map';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id',
        'user_id',
        'city_id',
        'area_id'
    ];



    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // 🏙️ Each mapping belongs to one city
    public function city()
    {
        return $this->belongsTo(City::class, 'city_id');
    }

    // 📍 Each mapping belongs to one area
    public function area()
    {
        return $this->belongsTo(Area::class, 'area_id');
    }

    public function dealer()
    {
        return $this->belongsTo(User::class, 'user_id');
    }



}
