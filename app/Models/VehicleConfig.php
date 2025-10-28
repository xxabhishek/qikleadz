<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VehicleConfig extends Model 
{
     use SoftDeletes;
    /**
     * Brand table
     *
     * @var string
     */
    protected $table = 'vehicle_configs';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id',
        'model_id',
        'variant_id',
        'fuel_type_id','country_id','price'
        
       
    ];
     

    
  

}
