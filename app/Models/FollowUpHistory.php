<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FollowUpHistory extends Model
{
    use HasFactory;
    protected $table = 'follow_up_history';
    protected $fillable = [
        'id',
        'lead_id',
        'follow_up_date',
        'follow_up_remark'
    ];
    public function lead()
    {
        return $this->belongsTo(Lead::class, 'lead_id');
    }
    public function creator ()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}