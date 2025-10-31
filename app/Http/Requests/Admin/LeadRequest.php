<?php

namespace App\Http\Requests\Admin;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class LeadRequest extends FormRequest
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

        // return [
        //     'customer_name' => 'required|string|max:255',
        //     'phone_no' => 'required|string|regex:/^\d{10}$/',
        //     'location' => 'nullable|string|max:255',
        //     'area' => 'nullable|string|max:255',
        //     'tentative_purchase_date' => 'nullable|date',
        //     'vehicle_qty' => 'required|integer|min:1',
        //     'payment_mode' => 'required|in:cash,finance',
        //     'additional_note' => 'nullable|string',
        //     'status' => 'required|in:Draft,Open',
        //     'brand_id' => 'required|integer|exists:brands,id',
        //     'variant_id' => 'required|integer|exists:variants,id',
        //     'lead_id' => 'nullable|integer|exists:leads,id',
        //     'color_id' => 'nullable|integer|exists:colors,id',
        // ];
        // app/Http/Requests/Admin/LeadRequest.php

        return [
            'lead_id' => 'nullable|exists:leads,id',
            'customer_name' => 'required|string|max:255',
            'phone_no' => [
                'required',
                'regex:/^\d{10}$/',
                Rule::unique('leads', 'phone_no')->ignore($this->route('lead')),
            ],
            'location' => 'nullable|string',
            'area' => 'nullable|string',
            'tentative_purchase_date' => 'nullable|date',
            'vehicle_qty' => 'required|integer|min:1',
            'payment_mode' => 'required|in:cash,finance',
            'additional_note' => 'nullable|string',
            'status' => 'required|in:Draft,Open',
            'city_id' => 'nullable|integer|exists:cities,id',
            'area_id' => 'nullable|integer|exists:areas,id',

            // VEHICLES

            // 'vehicles.*.id' => 'nullable|exists:lead_details,id',
            // 'vehicles.*.brand_id' => 'required|integer|exists:brands,id',
            // 'vehicles.*.variant_id' => 'required|integer|exists:variants,id',
            // 'vehicles.*.color_id' => 'nullable|integer|exists:colors,id',
        ];
    }


}
