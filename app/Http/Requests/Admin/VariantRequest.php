<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

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
            'name' => 'required|string|max:255|unique:variants,name,' . ($this->variant ? $this->variant->id : 'NULL'),
            'brand_id' => 'required|exists:brands,id',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'The variant name is required.',
            'name.unique' => 'This variant name is already in use.',
            'name.max' => 'The variant name must not exceed 255 characters.',
            'brand_id.required' => 'The Brand is required.',
            'brand_id.exists' => 'The selected Brand does not exist.',
        ];
    }
}
