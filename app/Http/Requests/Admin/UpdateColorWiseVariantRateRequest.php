<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;


class UpdateColorWiseVariantRateRequest extends FormRequest
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
            'variant_id' => 'required|integer|exists:variants,id',
            'color_id'      => 'required|integer',
            'price'       => 'required|numeric|min:0|max:99999999.99',

            // Unique: variant_id + color combination
            Rule::unique('color_wise_variant_rates')
                ->where(function ($query) {
                    return $query->where('variant_id', $this->variant_id)
                                 ->where('color', $this->color)
                                 ->whereNull('deleted_at');
                })
                ->ignore($this->id), // ignore current record
        ];
    }

    public function messages()
    {
        return [
            'variant_id.required' => 'Variant is required.',
            'color.required'      => 'Color is required.',
            'rate.required'       => 'Rate is required.',
            'rate.numeric'        => 'Rate must be a valid number.',
            'rate.min'            => 'Rate must be greater than or equal to 0.',
            'unique'              => 'This color already has a rate for the selected variant.',
        ];
    }


}
