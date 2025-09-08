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
            'name' => 'required|string|max:255',
            'industry_type_id' => 'required|exists:industry_types,id',
            'vehicle_type_id' => 'required|exists:vehicle_types,id',
            'flag' => 'nullable|image|mimes:jpg,png,jpeg|max:2048',
        ];
    }

}
