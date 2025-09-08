<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class TransmissionRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $id = $this->route('transmission'); // for update

        return [
            'name' => [
                'required',
                'string',
                'max:200',
                'regex:/^[A-Za-z\s()]+$/', 
                'unique:transmission,name,' . $id,
            ],
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'The transmission name is required.',
            'name.regex' => 'The name should only contain characters and spaces.',
            'name.unique' => 'This transmission already exists.',
        ];
    }
}
