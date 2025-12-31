<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class VehicleUsageRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Adjust based on your authorization logic (e.g., admin role)
    }

    public function rules()
    {

        // dd("Request File");
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('vehicle_usages')
                    ->where(fn($query) => $query
                     ->whereNull('deleted_at') // ✅ This line is critical
                    ->where('country_id', $this->country_id))
            ],
            'country_id' => 'required|exists:countries,id',      
        
        ];
    }



}
