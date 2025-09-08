<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class VehicleConfigRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'brand_i' => 'required|exists:brands,id',
            'variant_id' => 'required|exists:variants,id',
            'fuel_type_id' => 'required|exists:fuel_types,id',
            'country_id' => 'nullable|exists:countries,id',
            'price' => 'required|numeric|min:0'
        ];
    }
}
