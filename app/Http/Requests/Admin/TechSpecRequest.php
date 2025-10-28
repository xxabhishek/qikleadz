<?php

namespace App\Http\Requests\Admin;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class TechSpecRequest extends FormRequest
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
            //     'brand_id'    => 'required|exists:brands,id',
            // 'variant_id'  => 'required|exists:variants,id',
            // 'title'       => 'required|string|max:255',
            // 'description' => 'required|string|max:255',           

                        'brand_id'    => 'required|exists:brands,id',
            'variant_id'  => 'required|exists:variants,id',
            'titles'             => 'required|array|min:1',
        'titles.*'           => 'required|string|max:255',
        'descriptions'       => 'required|array|min:1',
            'descriptions.*' => 'required|string',


        ];
    }
}
