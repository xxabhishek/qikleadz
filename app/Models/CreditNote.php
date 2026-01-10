<?php

// app/Models/CreditNote.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CreditNote extends Model
{
    protected $table = 'credit_notes';

    protected $fillable = [
        'cn_no', 'distributor_id', 'lead_id', 'lead_detail_id',
        'converted_qty', 'total_incentive'
    ];

    public function distributor()
    {
        return $this->belongsTo(User::class, 'distributor_id');
    }

    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }

    public function detail()
    {
        return $this->belongsTo(LeadDetail::class, 'lead_detail_id');
    }
}