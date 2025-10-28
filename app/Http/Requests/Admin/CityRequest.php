<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // 'name' => 'required|string|unique|max:255',
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('cities')
                    ->where(fn($query) => $query->where('state_id', $this->state_id))
            ],
            'country_id' => 'required|exists:countries,id',
            'state_id'   => 'required|exists:states,id',
        
        ];
    }
}
