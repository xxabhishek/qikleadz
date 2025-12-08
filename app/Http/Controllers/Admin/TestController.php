<?php

namespace App\Http\Controllers\Admin;

use App\Models\Gallery;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

class TestController extends Controller
{
    public function testImageStorage()
    {
        try {
            // Get all galleries
            $galleries = Gallery::with(['brand', 'variant'])->get();

            $results = [];
            $storageInfo = [];

            foreach ($galleries as $index => $gallery) {
                $galleryData = [
                    'id' => $gallery->id,
                    'brand_name' => $gallery->brand ? $gallery->brand->name : 'N/A',
                    'variant_name' => $gallery->variant ? $gallery->variant->name : 'N/A',
                    'raw_cover_photos' => $gallery->cover_photos,
                    'processed_urls' => [],
                    'file_checks' => []
                ];

                // Process cover photos
                $photos = $gallery->cover_photos;

                // Convert string to array if needed
                if (is_string($photos)) {
                    try {
                        $photos = json_decode($photos, true);
                    } catch (\Exception $e) {
                        $photos = [$photos];
                    }
                }

                if (!is_array($photos)) {
                    $photos = [];
                }

                // Check each photo
                foreach ($photos as $photoIndex => $photo) {
                    $photoInfo = [
                        'original' => $photo,
                        'urls' => [],
                        'exists' => false,
                        'actual_path' => null
                    ];

                    // Extract filename from different formats
                    $filename = $this->extractFilename($photo);

                    if ($filename) {
                        // Generate all possible URLs
                        $possibleUrls = $this->generatePossibleUrls($filename);
                        $photoInfo['urls'] = $possibleUrls;

                        // Check if file exists in storage
                        $existenceCheck = $this->checkFileExistence($filename);
                        $photoInfo['exists'] = $existenceCheck['exists'];
                        $photoInfo['actual_path'] = $existenceCheck['path'];
                    }

                    $galleryData['processed_urls'][] = $photoInfo;
                }

                $results[] = $galleryData;
            }

            // Collect storage statistics
            $storageInfo = $this->collectStorageInfo();

            return response()->json([
                'success' => true,
                'message' => 'Image storage test completed',
                'summary' => [
                    'total_galleries' => count($galleries),
                    'total_images' => array_sum(array_map(function ($g) {
                        return count($g['processed_urls']);
                    }, $results)),
                    'images_found' => array_sum(array_map(function ($g) {
                        return count(array_filter($g['processed_urls'], function ($p) {
                            return $p['exists'];
                        }));
                    }, $results))
                ],
                'storage_info' => $storageInfo,
                'gallery_data' => $results,
                'test_urls' => [
                    'public_storage' => url('storage/galleries/test.jpg'),
                    'uploads_gallery' => url('uploads/gallery/test.jpg'),
                    'base_url' => url('/')
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error testing image storage',
                'error' => $e->getMessage(),
                'trace' => env('APP_DEBUG') ? $e->getTraceAsString() : null
            ], 500);
        }
    }

    public function checkSingleImage(Request $request)
    {
        $request->validate([
            'filename' => 'required|string'
        ]);

        $filename = $request->filename;

        $possibleUrls = $this->generatePossibleUrls($filename);
        $existenceCheck = $this->checkFileExistence($filename);

        return response()->json([
            'success' => true,
            'filename' => $filename,
            'possible_urls' => $possibleUrls,
            'file_exists' => $existenceCheck['exists'],
            'actual_path' => $existenceCheck['path'],
            'test_links' => array_map(function ($url) {
                return '<a href="' . $url . '" target="_blank">' . $url . '</a>';
            }, $possibleUrls)
        ]);
    }

    public function fixStorageLink()
    {
        try {
            // Run storage:link command
            $result = symlink(storage_path('app/public'), public_path('storage'));

            // Check directories
            $directories = [
                'storage/app/public/galleries' => is_dir(storage_path('app/public/galleries')),
                'public/storage' => is_dir(public_path('storage')),
                'public/uploads/gallery' => is_dir(public_path('uploads/gallery')),
                'public/uploads/galleries' => is_dir(public_path('uploads/galleries')),
            ];

            // Create directories if they don't exist
            foreach (['galleries', 'uploads/gallery', 'uploads/galleries'] as $dir) {
                $fullPath = storage_path('app/public/' . $dir);
                if (!is_dir($fullPath)) {
                    mkdir($fullPath, 0755, true);
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Storage link fixed',
                'symlink_created' => $result,
                'directories' => $directories,
                'paths' => [
                    'storage_path' => storage_path('app/public'),
                    'public_path' => public_path('storage'),
                    'app_url' => config('app.url')
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fix storage link',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function extractFilename($photo)
    {
        if (is_array($photo)) {
            return $photo['filename'] ?? $photo['path'] ?? $photo['url'] ?? null;
        }

        if (is_string($photo)) {
            // Remove any base URL
            $photo = str_replace(config('app.url'), '', $photo);
            $photo = str_replace('http://192.168.1.33:8000', '', $photo);

            // Get just the filename
            $photo = basename($photo);

            // Remove query strings if any
            $photo = explode('?', $photo)[0];

            return $photo;
        }

        return null;
    }

    private function generatePossibleUrls($filename)
    {
        $baseUrl = config('app.url', 'http://192.168.1.33:8000');

        return [
            'storage_galleries' => $baseUrl . '/storage/galleries/' . $filename,
            'storage_uploads_gallery' => $baseUrl . '/storage/uploads/gallery/' . $filename,
            'uploads_gallery' => $baseUrl . '/uploads/gallery/' . $filename,
            'uploads_galleries' => $baseUrl . '/uploads/galleries/' . $filename,
            'cover_photos' => $baseUrl . '/uploads/coverPhotos/' . $filename,
            'public_galleries' => $baseUrl . '/public/uploads/gallery/' . $filename,
            'direct_storage' => $baseUrl . '/storage/' . $filename,
        ];
    }

    private function checkFileExistence($filename)
    {
        $locations = [
            ['path' => public_path('storage/galleries/' . $filename), 'type' => 'public_storage'],
            ['path' => storage_path('app/public/galleries/' . $filename), 'type' => 'storage_app'],
            ['path' => public_path('uploads/gallery/' . $filename), 'type' => 'uploads_gallery'],
            ['path' => public_path('uploads/galleries/' . $filename), 'type' => 'uploads_galleries'],
            ['path' => public_path('uploads/coverPhotos/' . $filename), 'type' => 'cover_photos'],
            ['path' => public_path('storage/' . $filename), 'type' => 'direct_storage'],
        ];

        foreach ($locations as $location) {
            if (file_exists($location['path'])) {
                return [
                    'exists' => true,
                    'path' => $location['path'],
                    'type' => $location['type'],
                    'url' => str_replace(public_path(), config('app.url'), $location['path'])
                ];
            }
        }

        return ['exists' => false, 'path' => null, 'type' => 'not_found'];
    }

    private function collectStorageInfo()
    {
        return [
            'app_url' => config('app.url'),
            'filesystem_disk' => config('filesystems.default'),
            'public_disk_root' => config('filesystems.disks.public.root'),
            'public_disk_url' => config('filesystems.disks.public.url'),
            'directories' => [
                'storage_app_public' => is_dir(storage_path('app/public')),
                'public_storage' => is_dir(public_path('storage')),
                'is_symlinked' => is_link(public_path('storage')),
                'uploads_gallery' => is_dir(public_path('uploads/gallery')),
                'uploads_galleries' => is_dir(public_path('uploads/galleries')),
            ],
            'permissions' => [
                'storage' => substr(sprintf('%o', fileperms(storage_path())), -4),
                'public' => substr(sprintf('%o', fileperms(public_path())), -4),
            ]
        ];
    }
}