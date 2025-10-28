<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\validation\Rule;

class UpdateVehicleSegmentRequest extends FormRequest
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
                'max:255',
                Rule::unique('vehicle_segments')
                    ->where(fn($query) => $query->where('country_id', $this->country_id))
                    ->ignore($this->route('vehicle_segment')), // ignores the current segment being updated
            ],
            'country_id' => 'required|exists:countries,id',
        ];
    }
}
