<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class OEM extends Model
{
    use SoftDeletes;
    /**
     * Brand table
     *
     * @var string
     */
    protected $table = 'oem';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id',
        'name'


    ];






}
