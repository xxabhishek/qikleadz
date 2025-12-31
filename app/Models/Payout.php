<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payout extends Model
{
    use HasFactory;
    protected $table = 'payout';
    protected $fillable = [
        'distributor_id',
        'executive_name',
        'total_leads',
        'vehicle_sales',
        'claim_amount',
        'paid_amount',
        'balance_amount',
    ];
}