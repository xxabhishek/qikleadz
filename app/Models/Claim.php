<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Claim extends Model
{
    use HasFactory;

    protected $fillable = [
        'lead_id',
        'distributor_id',
        'executive_id',
        'dealer_id',
        'claim_amount',
        'verified_amount',
        'status',
        'notes',
        'verification_notes',
        'created_by',
        'verified_by',
        'verified_at'
    ];

    protected $casts = [
        'claim_amount' => 'decimal:2',
        'verified_amount' => 'decimal:2',
        'verified_at' => 'datetime'
    ];

    // Relationships
    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }

    public function distributor()
    {
        return $this->belongsTo(User::class, 'distributor_id');
    }

    public function executive()
    {
        return $this->belongsTo(User::class, 'executive_id');
    }

    public function dealer()
    {
        return $this->belongsTo(User::class, 'dealer_id');
    }

    public function verifier()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Status constants
    const STATUS_PENDING = 'pending';
    const STATUS_APPROVED = 'approved';
    const STATUS_REJECTED = 'rejected';
    const STATUS_DISPUTED = 'disputed';

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    public function scopeApproved($query)
    {
        return $query->where('status', self::STATUS_APPROVED);
    }

    public function scopeRejected($query)
    {
        return $query->where('status', self::STATUS_REJECTED);
    }

    public function scopeDisputed($query)
    {
        return $query->where('status', self::STATUS_DISPUTED);
    }

    // Helper methods
    public function isPending()
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function isApproved()
    {
        return $this->status === self::STATUS_APPROVED;
    }

    public function isRejected()
    {
        return $this->status === self::STATUS_REJECTED;
    }

    public function isDisputed()
    {
        return $this->status === self::STATUS_DISPUTED;
    }

    public function getStatusBadgeClass()
    {
        switch ($this->status) {
            case 'approved':
                return 'badge bg-success';
            case 'rejected':
                return 'badge bg-danger';
            case 'disputed':
                return 'badge bg-warning text-dark';
            case 'pending':
            default:
                return 'badge bg-info';
        }
    }
}
