<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class VehicleSegmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        // Adjust this based on your application's authorization logic
        // For now, return true to allow all authenticated users
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
            ],
            'country_id' => 'required|exists:countries,id',

        ];
    }



    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'name.required' => 'The vehicle type name is required.',
            'name.unique' => 'This vehicle type name is already in use.',
            'name.max' => 'The vehicle type name must not exceed 255 characters.',
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        // You can modify the input data here if needed
        // For example, trim the name field
        $this->merge([
            'name' => trim($this->name),
        ]);
    }
}
