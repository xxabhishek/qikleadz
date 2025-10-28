<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class CCRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {

        return [
            'name' => [
                'required',
                'numeric',
                Rule::unique('ccs', 'name'), // ensure unique CC values
            ],      
        
        
        ];
    }

}
