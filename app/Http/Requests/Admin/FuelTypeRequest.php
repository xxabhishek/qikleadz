<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;


class FuelTypeRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Adjust based on your authorization logic
    }

    public function rules()
    {
         return [
                        'name' => [
                                'required',
                                Rule::unique('fuel_types', 'name')->where(function ($query) {
                                    return $query->whereNull('deleted_at');
                                }),
                                'max:255',
                            ],
        ];
    }

}
