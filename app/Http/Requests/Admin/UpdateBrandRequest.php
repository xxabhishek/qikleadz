<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBrandRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [


            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('brands', 'name')
                    ->where(function ($query) {
                        return $query->where('country_id', $this->country_id);
                    })
                    ->ignore($this->route('brand')) // <-- important for update
            ],
            'vehicle_usage_id' => ['nullable', 'integer', 'exists:vehicle_usages,id'],
            'vehicle_segment_id' => ['nullable', 'integer', 'exists:vehicle_segments,id'],
            'country_id' => ['required', 'integer', 'exists:countries,id'],
            'oem_id' => 'nullable|exists:oem,id',

        ];
    }
}
