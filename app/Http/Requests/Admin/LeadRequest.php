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
    { {
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
                'vehicle_qty' => 'required|integer|min:1', // ✅ CHANGED TO REQUIRED
                'payment_mode' => 'required|in:cash,finance',
                'additional_note' => 'nullable|string',
                'status' => 'required|in:Draft,Open',
                'city_id' => 'nullable|integer|exists:cities,id',
                'area_id' => 'nullable|integer|exists:areas,id',
                'vehicles' => 'sometimes|array',
                'vehicles.*.id' => 'nullable|integer|exists:lead_details,id',
                'vehicles.*.brand_id' => 'required_with:vehicles|integer|exists:brands,id',
                'vehicles.*.variant_id' => 'required_with:vehicles|integer|exists:variants,id',
                'vehicles.*.color_id' => 'nullable|integer|exists:colors,id',
                'vehicles.*.vehicle_qty' => 'required_with:vehicles|integer|min:1', // ✅ ADD THIS
            ];
        }
    }
}
