<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('cities')
                    ->where(fn($query) => $query->where('state_id', $this->state_id))
                    ->ignore($this->route('city')), // ignore current city on update
            ],
            'country_id' => 'required|exists:countries,id',
            'state_id' => 'required|exists:states,id',

        ];
    }
}
