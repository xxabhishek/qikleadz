<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\DealerAreaMap;

class UpdateDealerAreaMapRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        // Get the record ID from the route
        // Adjust the route parameter name if it's different (e.g., 'dealer-area-map')
        $id = $this->route('dealer_area_map') ?? $this->route('id');

        return [
            'user_id' => [
                'required',
                'exists:users,id',
                function ($attribute, $value, $fail) use ($id) {
                    $cityId = $this->input('city_id');

                    // Check if another mapping exists with the same dealer + city (excluding this record)
                    $exists = DealerAreaMap::where('user_id', $value)
                        ->where('city_id', $cityId)
                        ->where('id', '!=', $id)
                        ->exists();

                    if ($exists) {
                        $fail('This dealer is already mapped to the selected city.');
                    }
                },
            ],
            'country_id' => 'nullable|exists:countries,id',
            'city_id'    => 'required|exists:cities,id',
            'area_ids'   => 'required|array|min:1',
            'area_ids.*' => 'exists:areas,id',
        ];
    }

    public function messages()
    {
        return [
            'user_id.required'   => 'Dealer is required.',
            'city_id.required'   => 'City is required.',
            'area_ids.required'  => 'Please select at least one area.',
            'area_ids.array'     => 'Please select at least one area.',
            'area_ids.min'       => 'Please select at least one area.',
            'area_ids.*.exists'  => 'Invalid area selected.',
        ];
    }

    //  public function rules()
    // {
    //     // Get record ID from route (works with route model binding or ID parameter)
    //     $id = $this->route('dealer_area_map') ?? $this->route('id');

    //     return [
    //         'user_id' => [
    //             'required',
    //             'exists:users,id',
    //             function ($attribute, $value, $fail) use ($id) {
    //                 $cityId = $this->input('city_id');

    //                 // Check if another mapping exists with the same dealer + city (excluding this record)
    //                 $exists = DealerAreaMap::where('user_id', $value)
    //                     ->where('city_id', $cityId)
    //                     ->where('id', '!=', $id)
    //                     ->exists();

    //                 if ($exists) {
    //                     $fail('This dealer is already mapped to the selected city.');
    //                 }
    //             },
    //         ],
    //         'city_id' => 'required|exists:cities,id',
    //         'area_id' => 'required|exists:areas,id', // ✅ Single area instead of array
    //     ];
    // }

    // public function messages()
    // {
    //     return [
    //         'user_id.required'  => 'Please select a dealer.',
    //         'city_id.required'  => 'Please select a city.',
    //         'area_id.required'  => 'Please select an area.',
    //         'area_id.exists'    => 'Invalid area selected.',
    //     ];
    // }
}
