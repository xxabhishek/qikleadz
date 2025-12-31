<?php

namespace App\Traits;

trait HasRoleTrait
{
    /**
     * CORRECT ROLE IDs BASED ON YOUR DATABASE
     * These methods work alongside Spatie
     */

    public function isAdmin()
    {
        // Use Spatie's hasRole if available, otherwise check role ID
        if (method_exists($this, 'hasRole')) {
            return $this->hasRole('Admin');
        }
        return $this->role == 1;
    }

    public function isDistributor()
    {
        if (method_exists($this, 'hasRole')) {
            return $this->hasRole('Distributor');
        }
        return $this->role == 2;
    }

    public function isDealer()
    {
        if (method_exists($this, 'hasRole')) {
            return $this->hasRole('Dealer');
        }
        return $this->role == 3;
    }

    public function isExecutive()
    {
        if (method_exists($this, 'hasRole')) {
            return $this->hasRole('Executive');
        }
        return $this->role == 4;
    }

    public function isGssAdmin()
    {
        if (method_exists($this, 'hasRole')) {
            return $this->hasRole('GSS-Admin');
        }
        return $this->role == 5;
    }

    public function getRoleName()
    {
        // Try to get role name from Spatie first
        if (method_exists($this, 'getRoleNames')) {
            $roles = $this->getRoleNames();
            return $roles->isNotEmpty() ? $roles->first() : 'No Role';
        }

        // Fallback to ID mapping
        $roles = [
            1 => 'Admin',
            2 => 'Distributor',
            3 => 'Dealer',
            4 => 'Executive',
            5 => 'GSS-Admin',
        ];

        return $roles[$this->role] ?? 'Unknown Role (ID: ' . $this->role . ')';
    }
}
