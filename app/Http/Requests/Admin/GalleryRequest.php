<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class GalleryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $galleryId = $this->route('gallery');

        return [
            'cover_photo' => [
                $galleryId ? 'nullable' : 'required',
                'file',
                'mimes:jpeg,png,jpg,gif,mp4,mov,avi,wmv',
                'max:20480'
            ],
            'brand_id'     => 'required|exists:brands,id',
            'variant_id'   => 'required|exists:variants,id',
            'color_id'     => 'required|exists:color,id', // ✅ table is "color"
            'fuel_type_id' => 'required|exists:fuel_types,id',
        ];
    }

    public function messages(): array
    {
        return [
            'cover_photo.required' => 'Cover photo is required.',
            'brand_id.exists'      => 'Invalid brand selected.',
            'variant_id.exists'    => 'Invalid variant selected.',
            'color_id.exists'      => 'Invalid color selected.',
            'fuel_type_id.exists'  => 'Invalid fuel type selected.',
        ];
    }
}
