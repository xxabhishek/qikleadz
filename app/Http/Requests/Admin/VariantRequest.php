<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class VariantRequest extends FormRequest
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
                Rule::unique('variants', 'name')
                    ->where(function ($query) {
                        return $query->where('country_id', $this->country_id)
                            ->where('brand_id', $this->brand_id);
                    })
                    ->ignore($this->route('variant')) // for update
            ],
            'fuel_type_id' => ['required', 'integer', 'exists:fuel_types,id'],
            'transmission_id' => ['nullable', 'integer', 'exists:transmission,id'],
            'color_id' => ['nullable'],
            'cc_id' => ['nullable', 'integer', 'exists:ccs,id'],
            'vehicle_usage_id' => ['nullable', 'integer', 'exists:vehicle_usages,id'],
            'basic_price' => ['nullable', 'numeric', 'min:0'],
            'brand_id' => ['required', 'integer', 'exists:brands,id'],
            'country_id' => ['required', 'integer', 'exists:countries,id'],
            'commission' => ['nullable', 'numeric', 'min:0'],
            'brochure' => ['nullable', 'file', 'mimes:pdf,jpeg,jpg,png', 'max:2048'],


        ];
    }

    /**
     * Custom messages for validation errors
     */
    public function messages()
    {
        return [
            'name.required' => 'Variant name is required.',
            'name.unique' => 'This variant already exists for the selected brand and country.',
            'fuel_type_id.required' => 'Fuel type is required.',
            'fuel_type_id.exists' => 'Invalid fuel type selected.',
            'transmission_id.exists' => 'Invalid transmission selected.',
            'cc_id.exists' => 'Invalid CC selected.',
            'vehicle_usage_id.exists' => 'Invalid vehicle usage selected.',
            'brand_id.required' => 'Brand is required.',
            'brand_id.exists' => 'Invalid brand selected.',
            'country_id.required' => 'Country is required.',
            'country_id.exists' => 'Invalid country selected.',
            'brochure.file' => 'Brochure must be a valid file.',
            'brochure.mimes' => 'Brochure must be a PDF or image (jpeg, jpg, png).',
            'brochure.max' => 'Brochure size must not exceed 2MB.',
        ];
    }

}
