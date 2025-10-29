<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\GalleryRequest;
use Illuminate\Http\Request;
use App\Services\GalleryService;
use App\Models\Gallery;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;


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
            // $data['cover_photos'] = $filename;
            $data['cover_photos'] = 'uploads/coverPhotos/' . $filename;

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

   public function getGalleries()
{
    try {
        $galleries = DB::table('galleries')
            ->leftJoin('lead_details', function ($join) {
                $join->on('galleries.variant_id', '=', 'lead_details.variant_id')
                     ->where('lead_details.status', '=', 'Open');
            })
            ->leftJoin('brands', 'galleries.brand_id', '=', 'brands.id')
            ->leftJoin('variants', 'galleries.variant_id', '=', 'variants.id')
            ->leftJoin('colors', 'galleries.color_id', '=', 'colors.id')
            ->leftJoin('fuel_types', 'galleries.fuel_type_id', '=', 'fuel_types.id')
            ->select(
                'galleries.id',
                DB::raw('CONCAT("'.url('/').'/", galleries.cover_photos) as cover_photos_url'),
                'brands.name as brand_name',
                'variants.name as variant_name',
                'colors.name as color_name',
                'fuel_types.name as fuel_type_name',
                DB::raw('COUNT(lead_details.id) as open_leads_count')
            )
            ->groupBy(
                'galleries.id',
                'galleries.cover_photos',
                'brands.name',
                'variants.name',
                'colors.name',
                'fuel_types.name'
            )
            ->orderBy('galleries.id', 'DESC')
            ->limit(20)
            ->get();

        return response()->json(['status' => true, 'data' => $galleries]);
    } catch (\Exception $e) {
        \Log::error("Failed to fetch galleries: " . $e->getMessage());
        return response()->json(['status' => false, 'message' => 'Something went wrong'], 500);
    }
}


}
