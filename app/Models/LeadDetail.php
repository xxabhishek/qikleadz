<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LeadDetail extends Model
{

    /**
     * Brand table
     *
     * @var string
     */

    protected $table = 'lead_details';
    // protected $table

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id',
        'lead_no',
        'lead_id',
        'brand_id',
        'variant_id',
        'color_id',
        'status',
        'invoice_no',
        'uploaded_invoice',
        'close_reason',
        'total_price',
        'vehicle_qty',
        'converted_qty',
        'unit_price'
    ];


    public function brand()
    {
        return $this->belongsTo(Brand::class, 'brand_id');

    }


    public function variant()
    {
        return $this->belongsTo(Variant::class, 'variant_id');

    }

    public function color()
    {
        return $this->belongsTo(Color::class, 'color_id');
    }

    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }
    protected static function booted()
    {
        static::creating(function ($lead) {
            if (empty($lead->lead_no)) {
                $lead->lead_no = self::generateLeadNo();
            }
        });
    }

    /**
     * Generate unique Lead No in format LAA0001, LAA0002, etc.
     */
    public static function generateLeadNo(): string
    {
        $lastLead = self::orderBy('id', 'desc')->first();

        if (!$lastLead || !preg_match('/LAA(\d{4})/', $lastLead->lead_no ?? '', $matches)) {
            $nextNumber = 1;
        } else {
            $nextNumber = (int) $matches[1] + 1;
        }

        return 'LAA' . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
    }

    public function creditNote()
    {
        return $this->hasOne(CreditNote::class, 'lead_detail_id');
    }

    

}
