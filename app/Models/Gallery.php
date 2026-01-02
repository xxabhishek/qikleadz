<?php

// namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;

// class Gallery extends Model
// {
//     use HasFactory;
//     protected $table = "galleries";
//     protected $fillable = [
//         'cover_photos',
//         'upload_videos',
//         'brand_id',
//         'variant_id',
//         'color_id',
//         'fuel_type_id',
//     ];

//     // In your Gallery model
//     protected $casts = [
//         'cover_photos' => 'array',
//         'upload_videos' => 'array',
//     ];










//     public function fuelType()
//     {
//         return $this->belongsTo(FuelType::class);
//     }


//     public function leadDetails()
//     {
//         return $this->hasMany(LeadDetail::class, 'variant_id', 'variant_id');
//     }

//     protected $appends = ['cover_photo_urls'];

//     public function getCoverPhotoUrlsAttribute()
//     {
//         $photos = $this->cover_photos;

//         // When stored as JSON string in DB
//         if (is_string($photos)) {
//             $photos = json_decode($photos, true);
//         }

//         // When stored as array
//         if (!is_array($photos)) {
//             $photos = [];
//         }

//         return array_map(function ($photo) {
//             return url('uploads/gallery/' . $photo);
//         }, $photos);
//     }

// }




namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Gallery extends Model
{
    use HasFactory;

    protected $table = "galleries";
    protected $fillable = [
        'cover_photos',
        'upload_videos',
        'brand_id',
        'variant_id',
        'color_id',
        'fuel_type_id',
    ];
    protected $visible = [
        'id',
        'brand_id',
        'variant_id',
        'color_id',
        'cover_photos',
        'cover_photo_urls',
        'first_cover_photo',
        'brand',
        'variant',
        'color'
    ];
    protected $casts = [
        'cover_photos' => 'array',
        'upload_videos' => 'array',
    ];

    protected $appends = ['cover_photo_urls', 'first_cover_photo'];

    // Relationships remain the same...

    // Improved accessor for cover photo URLs
    public function getCoverPhotoUrlsAttribute()
    {
        $photos = $this->cover_photos;

        if (is_string($photos)) {
            $photos = json_decode($photos, true);
        }

        if (!is_array($photos)) {
            return [];
        }

        return array_map(function ($photo) {
            return $this->getFullImageUrl($photo);
        }, $photos);
    }

    // Get first cover photo
    public function getFirstCoverPhotoAttribute()
    {
        $photos = $this->cover_photo_urls;
        return !empty($photos) ? $photos[0] : $this->getDefaultImageUrl();
    }

    // Helper method to get full image URL
    private function getFullImageUrl($photo)
    {
        // If photo is null or empty
        if (empty($photo)) {
            return $this->getDefaultImageUrl();
        }

        // If photo is already a full URL
        if (is_string($photo) && strpos($photo, 'http') === 0) {
            return $photo;
        }

        // If photo is an array
        if (is_array($photo)) {
            $photo = $photo['url'] ?? $photo['path'] ?? $photo['filename'] ?? null;
        }

        // If still empty
        if (empty($photo)) {
            return $this->getDefaultImageUrl();
        }

        // Clean the path
        $photo = ltrim($photo, '/\\');

        // Try multiple possible storage locations
        $possiblePaths = [
            // Laravel storage path (after php artisan storage:link)
            'storage/galleries/' . $photo,
            'storage/uploads/galleries/' . $photo,
            'storage/uploads/gallery/' . $photo,

            // Public uploads path
            'uploads/galleries/' . $photo,
            'uploads/gallery/' . $photo,
            'uploads/coverPhotos/' . $photo,

            // Direct paths
            $photo,
        ];

        // Return the first valid URL
        foreach ($possiblePaths as $path) {
            $url = asset($path);
            // Note: In production, you might want to verify the file exists
            return $url;
        }

        return $this->getDefaultImageUrl();
    }

    // Default image URL
    private function getDefaultImageUrl()
    {
        return asset('images/default-vehicle.png');
    }
    public function brand()
    {
        return $this->belongsTo(Brand::class, 'brand_id');
    }
    public function variant()
    {
        return $this->belongsTo(Variant::class, 'variant_id');
    }

    public function color()
    {
        return $this->belongsTo(Color::class, 'color_id');
    }
    public function fuelType()
    {
        return $this->belongsTo(FuelType::class, 'fuel_type_id');
    }

}
