<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class CCRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $id = $this->route('cc');

        return [
            'name' => [
                'required',
                'string',
                'max:200',
                'regex:/^[\w\s\W]+$/',
                'unique:cc,name,' . $id,
            ],
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'The name field is required.',
            'name.unique' => 'This CC name already exists.',
            'name.regex' => 'The name can only contain numbers, characters, and symbols.',
        ];
    }
}
