<?php

namespace App\Http\Requests\Admin;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class UpdateVariantRequest extends FormRequest
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
                    ->ignore($this->route('variant')), // ensures update works
            ],
            'fuel_type_id' => 'required|exists:fuel_types,id',
            'transmission_id' => 'required|exists:transmission,id',
            'color_id' => 'required', // or "array" if you normalize colors in pivot table
            'cc_id' => 'required|exists:ccs,id',
            'vehicle_usage_id' => 'required|exists:vehicle_usages,id',
            'basic_price' => 'required|numeric|min:0',
            'brand_id' => 'required|exists:brands,id',
            'country_id' => 'required|exists:countries,id',
            'commission' => 'nullable|numeric|min:0',
            'brochure' => 'nullable|mimes:pdf,jpeg,png,jpg|max:2048',

        ];

    }

}
