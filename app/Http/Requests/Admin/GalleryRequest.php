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
        return [
            'oem_id' => 'required|exists:oem,id',
            'cover_photos' => 'required|array|max:8', // max 8 images
            'cover_photos.*' => 'image|max:1024', // 1MB each
            'upload_videos' => 'nullable|array|max:2', // max 2 videos
            'upload_videos.*' => 'mimes:mp4|max:10240', // 10MB each
            'brand_id' => 'required|exists:brands,id',
            'variant_id' => 'required|exists:variants,id',
            'color_id' => 'required|exists:colors,id',
            'fuel_type_id' => 'required|exists:fuel_types,id',
        ];
    }
}
