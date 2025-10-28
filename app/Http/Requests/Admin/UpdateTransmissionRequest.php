<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\validation\Rule;

class UpdateTransmissionRequest extends FormRequest
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
                'max:250',
                Rule::unique('transmission', 'name')
                    ->ignore($this->route('transmission')) // ignores current ID (from route model binding)
                    ->whereNull('deleted_at'), // if you’re using soft deletes
            ],
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'The transmission name is required.',
            'name.unique'   => 'This transmission already exists.',
            'name.max'      => 'The transmission name may not be greater than 250 characters.',
        ];
    }

}
