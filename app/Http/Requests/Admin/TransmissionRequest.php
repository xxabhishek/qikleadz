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

        'name' => 'required|string|max:255|unique:transmission,name,NULL,id,deleted_at,NULL',

                ];
    }

}
