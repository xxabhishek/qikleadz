<?php

namespace App\Http\Requests\Admin;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class ColorWiseVariantRateRequest extends FormRequest
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
            'country_id' => 'required|integer|exists:countries,id',
            'brand_id' => 'required|integer|exists:brands,id',
            'variant_id' => 'required|integer|exists:variants,id',
            'color_id' => 'required|integer|exists:colors,id',

            'price' => 'required|numeric|min:0|max:99999999.99',

            // Prevent duplicate entry for same Variant + Color
            // (Soft delete aware)
            'tax' => 'nullable|numeric',
            'other' => 'nullable|numeric',
            Rule::unique('variant_color_prices')
                ->where(function ($query) {
                    return $query->where('variant_id', $this->variant_id)
                        ->where('color_id', $this->color_id)
                        ->whereNull('deleted_at');
                }),
        ];
    }

    public function messages()
    {
        return [
            'country_id.required' => 'Please select a country.',
            'brand_id.required' => 'Please select a brand.',
            'variant_id.required' => 'Please select a variant.',
            'color_id.required' => 'Please select a color.',
            'price.required' => 'Please enter price.',
            'price.numeric' => 'Price must be a valid number.',
            'price.min' => 'Price must be greater than zero.',
            'unique' => 'This color already has a rate for the selected variant.',
        ];
    }

}
