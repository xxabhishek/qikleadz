<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IncentivePayment extends Model
{
    use HasFactory;
    protected $fillable = ['distributor_id', 'amount', 'paid_at', 'status', /* other fields */];
}
