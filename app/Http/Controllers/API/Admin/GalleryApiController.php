<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\GalleryRequest;
use Illuminate\Http\Request;
use App\Services\GalleryService;
use App\Models\Gallery;
use Illuminate\Support\Str;

class GalleryApiController extends Controller
{
    protected $galleryService;

    public function __construct(GalleryService $galleryService)
    {
        $this->galleryService = $galleryService;
    }

    // ✅ Get all galleries
    public function index()
    {
        $galleries = $this->galleryService->getAll();
        return response()->json([
            'status' => true,
            'data' => $galleries
        ]);
    }

    // ✅ Create new gallery
    public function store(GalleryRequest $request)
    {
        $data = $request->all();

        if ($request->hasFile('cover_photos')) {
            $file = $request->file('cover_photos');
            $filename = date('Y-m-d') . "_" . Str::random(14) . "_" . $file->getClientOriginalName();
            $file->move(public_path('uploads/coverPhotos'), $filename);
            $data['cover_photos'] = $filename;
        }

        $gallery = Gallery::create($data); // Directly use Model for testing

        return response()->json([
            'message' => 'Gallery created successfully',
            'data' => $gallery
        ], 201);
    }




    // ✅ Show single gallery
    public function show($id)
    {
        $gallery = Gallery::findOrFail($id);
        return response()->json([
            'status' => true,
            'data' => $gallery
        ]);
    }

    // ✅ Update gallery
    public function update(Request $request, $id)
    {
        $gallery = Gallery::findOrFail($id);

        $request->validate([
            'brand_id' => 'required|exists:brands,id',
            'variant_id' => 'required|exists:variants,id',
            'color_id' => 'required|exists:colors,id',
            'fuel_type_id' => 'required|exists:fuel_types,id',
            'cover_photos' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:2048'
        ]);

        $data = $request->all();

        // File update
        if ($request->hasFile('cover_photos')) {
            // delete old
            if ($gallery->cover_photos && file_exists(public_path('uploads/coverPhotos/' . $gallery->cover_photos))) {
                unlink(public_path('uploads/coverPhotos/' . $gallery->cover_photos));
            }

            $file = $request->file('cover_photos');
            $filename = date('Y-m-d') . "_" . Str::random(14) . "_" . $file->getClientOriginalName();
            $file->move(public_path('uploads/coverPhotos'), $filename);
            $data['cover_photos'] = $filename;
        }

        $this->galleryService->update($data, $id);

        return response()->json([
            'status' => true,
            'message' => 'Gallery updated successfully'
        ]);
    }

    // ✅ Delete gallery
    public function destroy($id)
    {
        $gallery = Gallery::findOrFail($id);

        // delete file
        if ($gallery->cover_photos && file_exists(public_path('uploads/coverPhotos/' . $gallery->cover_photos))) {
            unlink(public_path('uploads/coverPhotos/' . $gallery->cover_photos));
        }

        $this->galleryService->delete($gallery);

        return response()->json([
            'status' => true,
            'message' => 'Gallery deleted successfully'
        ]);
    }
}
