<?php

namespace App\Http\Requests\Admin;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class DealerAreaMapRequest extends FormRequest
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
                   
            'user_id' => 'required|exists:users,id',
             'city_id' => 'required|exists:cities,id',
            'area_ids'   => 'required|array|min:1',
            'area_ids.*' => 'exists:areas,id',
            // 'area_id' => 'required|exists:areas,id', // single dropdown value
        ];
    }

    /**
     * Custom messages for validation.
     */
    public function messages()
    {
        return [
        'user_id.required' => 'Please select a dealer.',
        'city_id.required' => 'Please select a city.',
        'area_id.required' => 'Please select an area.',
        'user_id.exists'   => 'Invalid dealer selected.',
        'city_id.exists'   => 'Invalid city selected.',
        'area_id.exists'   => 'Invalid area selected.',        ];
    }
}
