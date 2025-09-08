<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class FuelTypeRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Adjust based on your authorization logic
    }

    public function rules()
    {
         return [
            'name' => 'required|string|max:255|unique:vehicle_segment,name,' . ($this->vehicle_type ? $this->vehicle_type->id : 'NULL'),
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'The fuel type name is required.',
            'name.unique' => 'This fuel type name is already in use.',
            'name.max' => 'The fuel type name must not exceed 255 characters.',
        ];
    }
}
