<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // 'name' => 'required|string|max:255',
            // 'country_id' => 'required|exists:countries,id',

            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('states')
                    ->where('country_id', $this->country_id) // ensure unique state within the country
                    ->ignore($this->route('state')), // ignore when updating
            ],
            'country_id' => 'required|exists:countries,id',
        ];
    }
}
