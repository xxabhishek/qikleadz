<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCCRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'numeric',
                Rule::unique('ccs', 'name')
                    ->ignore($this->route('cc')), // ignore current record while updating
            ],
        ];
    }
}
