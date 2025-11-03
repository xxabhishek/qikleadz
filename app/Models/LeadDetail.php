<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LeadDetail extends Model
{
    use SoftDeletes;
    /**
     * Brand table
     *
     * @var string
     */
    protected $table = 'lead_details';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id',
        'lead_id',
        'brand_id',
        'variant_id',
        'color_id',
        'status',
        'invoice_no',
        'uploaded_invoice'
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


}
