<?php

namespace App\Http\Requests\Admin;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class BrandRequest extends FormRequest
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
                    ->ignore($this->route('brand')) // for update case
            ],
            'vehicle_usage_id' => ['nullable', 'integer', 'exists:vehicle_usages,id'],
            'vehicle_segment_id' => ['nullable', 'integer', 'exists:vehicle_segments,id'],
            'country_id' => ['required', 'integer', 'exists:countries,id'],
            'oem_id' => 'required|exists:oem,id',


        ];
    }

    /**
     * Custom messages for validation errors
     */
    public function messages()
    {
        return [
            'name.required' => 'Brand name is required.',
            'name.unique' => 'This brand already exists for the selected country.',
            'country_id.required' => 'Please select a country.',
            'vehicle_usage_id.exists' => 'Invalid vehicle usage selected.',
            'vehicle_segment_id.exists' => 'Invalid vehicle segment selected.',
            'country_id.exists' => 'Invalid country selected.',
        ];
    }

}
