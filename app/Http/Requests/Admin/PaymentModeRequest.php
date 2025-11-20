<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PaymentModeRequest extends FormRequest
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
                Rule::unique('payment_modes', 'name')->where(function ($query) {
                    return $query->whereNull('deleted_at');
                }),
                'max:100'
            ],
        ];
    }
}
