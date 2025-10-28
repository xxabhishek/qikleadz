<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateFeatureRequest extends FormRequest
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
    // public function rules()
    // {
    //     return [
    //         'brand_id'    => 'required|exists:brands,id',
    //         'variant_id'  => 'required|exists:variants,id',
    //         'title'       => [
    //             'required',
    //             'string',
    //             'max:255',
    //             Rule::unique('features', 'title')
    //                 ->where(function ($query) {
    //                     return $query->where('brand_id', $this->brand_id)
    //                                  ->where('variant_id', $this->variant_id);
    //                 })
    //                 ->ignore($this->route('feature')), // ignore current feature id
    //         ],
    //         'description' => 'required|string|max:255',
    //     ];
    // }


     public function rules()
    {
        return [
            'brand_id'       => 'required|exists:brands,id',
            'variant_id'     => 'required|exists:variants,id',

            // Multiple titles and descriptions (arrays)
            'titles'         => 'required|array|min:1',
            'titles.*'       => 'required|string|max:255',

            'descriptions'   => 'required|array|min:1',
            'descriptions.*' => 'required|string',

            // Optional: IDs of existing features
            'feature_ids'    => 'array',
            'feature_ids.*'  => 'nullable|integer|exists:features,id',

            // Optional: delete checkboxes
            'delete_ids'     => 'array',
            'delete_ids.*'   => 'nullable|integer|exists:features,id',
        ];
    }

    /**
     * Custom messages (optional).
     */
    public function messages()
    {
        return [
            'titles.*.required'       => 'Each feature must have a title.',
            'descriptions.*.required' => 'Each feature must have a description.',
        ];
    }
}
