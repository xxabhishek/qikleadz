<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class VehicleUsageRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Adjust based on your authorization logic (e.g., admin role)
    }

    public function rules()
    {
        $id = $this->route('vehicle_usage') ?? null;

        return [
            'name' => 'required|string|max:255|unique:vehicle_usage,name,' . $id,
        ];
    }




    public function messages()
    {
        return [
            'name.required' => 'The VehicleUs age type name is required.',
            'name.unique' => 'This VehicleUs age type name is already in use.',
            'name.max' => 'The VehicleUsage type name must not exceed 255 characters.',
        ];
    }
}
