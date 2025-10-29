<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGalleryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    // public function rules(): array
    // {
    //     return [
    //         'cover_photos' => 'nullable|array|max:8',
    //         'cover_photos.*' => 'image|mimes:jpeg,jpg,png|max:1024',
    //         'upload_videos' => 'nullable|array|max:2',
    //         'upload_videos.*' => 'mimes:mp4|max:10240',
    //         'brand_id' => 'required|exists:brands,id',
    //         'variant_id' => 'required|exists:variants,id',
    //         'color_id' => 'required|exists:colors,id',
    //         'fuel_type_id' => 'required|exists:fuel_types,id',
    //     ];
    // }


    public function rules(): array
    {
        return [
            //  'oem_id' => 'required|exists:oem,id',
            'cover_photos' => 'nullable|array',
            'cover_photos.*' => 'image|mimes:jpeg,jpg,png,webp|max:1024',
            'upload_videos' => 'nullable|array|max:2',
            'upload_videos.*' => 'mimes:mp4|max:10240',
            'brand_id' => 'required|exists:brands,id',
            'variant_id' => 'required|exists:variants,id',
            'color_id' => 'required|exists:colors,id',
            'fuel_type_id' => 'required|exists:fuel_types,id',
        ];
    }

    // public function withValidator($validator)
    // {
    //     $validator->after(function ($validator) {
    //         $gallery = $this->route('gallery'); // current gallery model
    //         $existing = $gallery->cover_photos;

    //         // decode JSON if stored as string
    //         if (is_string($existing)) {
    //             $existing = json_decode($existing, true) ?? [];
    //         }

    //         // count existing after removing selected ones
    //         $remove = $this->input('remove_photos', []);
    //         $remaining = array_diff($existing, $remove);

    //         // count new uploads
    //         $new = $this->file('cover_photos', []);
    //         $total = count($remaining) + count($new);

    //         if ($total > 8) {
    //             $validator->errors()->add('cover_photos', 'You can only have a maximum of 8 cover photos.');
    //         }
    //     });
    // }


}