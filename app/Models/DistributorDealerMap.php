<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DistributorDealerMap extends Model
{
    use SoftDeletes;
    /**
     * Brand table
     *
     * @var string
     */
    protected $table = 'distributor_dealer_map';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id',
        'user_id',     // Distributor ID
        'dealer_id',   // Dealer ID
            ];



public function distributor()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the dealer (user) associated with the map.
     */
    public function dealer()
    {
        return $this->belongsTo(User::class, 'dealer_id');
    }




}
