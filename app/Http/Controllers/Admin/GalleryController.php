<?php

// namespace App\Http\Controllers\Admin;

// use App\Http\Controllers\Controller;
// use App\Http\Requests\Admin\GalleryRequest;
// use App\Http\Requests\Admin\UpdateGalleryRequest;
// use App\Services\GalleryService;
// use App\Services\BrandService;
// use App\Services\VariantService;
// use App\Services\ColorService;
// use App\Services\FuelTypeService;
// use App\Models\Gallery;
// use App\Models\Color;
// use Illuminate\Support\Facades\File;
// use Illuminate\Support\Str;


// class GalleryController extends Controller
// {
//     /** @var GalleryService */
//     protected $galleryService;

//     protected $brandService;
//     protected $variantService;
//     protected $colorService;
//     protected $fuelTypeService;

//     /**
//      * GalleryController constructor.
//      * @param GalleryService $galleryService
//      */


//     public function __construct(
//         GalleryService $galleryService,
//         BrandService $brandService,
//         VariantService $variantService,
//         ColorService $colorService,
//         FuelTypeService $fuelTypeService
//     ) {
//         $this->galleryService = $galleryService;
//         $this->brandService = $brandService;
//         $this->variantService = $variantService;
//         $this->colorService = $colorService;
//         $this->fuelTypeService = $fuelTypeService;
//     }

//     public function index()
//     {
//         $galleries = $this->galleryService->getAll();
//         return view('admin.galleries.index', compact('galleries'));
//     }

//     public function create()
//     {
//         $brands = $this->brandService->getAll();
//         $variants = $this->variantService->getAll();
//         $colors = $this->colorService->getAll();
//         $fuelTypes = $this->fuelTypeService->getAll();

//         return view('admin.galleries.create', compact('brands', 'variants', 'colors', 'fuelTypes'));
//     }

//     public function store(GalleryRequest $request)
//     {
//         dd($request->all());
//         try {
//             // Validate inputs
//             $request->validate([
//                 'cover_photos.*' => 'required|image|mimes:jpeg,jpg,png|max:1024', // 1MB
//                 'upload_videos.*' => 'nullable|mimes:mp4|max:10240', // 10MB
//                 'brand_id' => 'required|exists:brands,id',
//                 'variant_id' => 'required|exists:variants,id',
//                 'color_id' => 'required|exists:colors,id',
//                 'fuel_type_id' => 'required|exists:fuel_types,id',
//             ]);

//             $data = $request->only([
//                 'brand_id',
//                 'variant_id',
//                 'color_id',
//                 'fuel_type_id'
//             ]);

//             // Handle cover photos
//             if ($request->hasFile('cover_photos')) {
//                 $coverPhotos = [];
//                 foreach ($request->file('cover_photos') as $file) {
//                     $filename = date('Y-m-d') . "_" . Str::random(14) . "_" . $file->getClientOriginalName();
//                     $file->move(public_path('uploads/coverPhotos'), $filename);
//                     $coverPhotos[] = $filename;
//                 }
//                 $data['cover_photos'] = json_encode($coverPhotos);
//             }

//             // Handle videos
//             if ($request->hasFile('upload_videos')) {
//                 $videos = [];
//                 foreach ($request->file('upload_videos') as $file) {
//                     $filename = date('Y-m-d') . "_" . Str::random(14) . "_" . $file->getClientOriginalName();
//                     $file->move(public_path('uploads/galleryVideos'), $filename);
//                     $videos[] = $filename;
//                 }
//                 $data['upload_videos'] = json_encode($videos);
//             }

//             // Create gallery record
//             $this->galleryService->create($data);

//             return redirect()->route('galleries.index')->with('success', 'Gallery created successfully.');
//         } catch (\Exception $e) {
//             return back()->withErrors(['error' => $e->getMessage()]);
//         }
//     }




//     // public function store(GalleryRequest $request)
//     // {
//     //     try {
//     //         $data = $request->all(); // start with validated fields

//     //         if ($request->hasFile('cover_photos')) {
//     //             $file = $request->file('cover_photos');

//     //             // validate file size <= 2MB
//     //             if ($file->getSize() > 2097152) { // 2MB
//     //                 return back()->withErrors(['cover_photos' => 'File size must not exceed 2MB']);
//     //             }

//     //             // generate unique filename
//     //             $filename = date('Y-m-d') . "_" . Str::random(14) . "_" . $file->getClientOriginalName();
//     //             $file->move(public_path('uploads/coverPhotos'), $filename);

//     //             $data['cover_photos'] = $filename; // ✅ add to $data
//     //         }

//     //         // ✅ Pass $data including cover_photos to service
//     //         $this->galleryService->create($data);


//     //         return redirect()->route('galleries.index')->with('success', 'Gallery created successfully.');
//     //     } catch (\Exception $e) {
//     //         return back()->withErrors(['error' => $e->getMessage()]);
//     //     }
//     // }

//     public function edit(Gallery $gallery)
//     {
//         $brands = $this->brandService->getAll();
//         $variants = $this->variantService->getAll();
//         $colors = $this->colorService->getAll();
//         $fuelTypes = $this->fuelTypeService->getAll();

//         return view('admin.galleries.edit', compact('gallery', 'brands', 'variants', 'colors', 'fuelTypes'));
//     }

//     // public function update(GalleryRequest $request, Gallery $gallery)
//     // {
//     //     try {
//     //         $this->galleryService->update($gallery, $request->validated());
//     //         return redirect()->route('galleries.index')->with('success', 'Gallery updated successfully.');
//     //     } catch (\Exception $e) {
//     //         return back()->withErrors(['error' => $e->getMessage()]);
//     //     }
//     // }





//     /**
//      * @param UpdateGalleryRequest $request
//      * @param $id
//      * @return mixed
//      */




//     public function update(UpdateGalleryRequest $request, $id)
//     {
//         try {
//             $gallery = Gallery::findOrFail($id);

//             $data = $request->only([
//                 'brand_id',
//                 'variant_id',
//                 'color_id',
//                 'fuel_type_id'
//             ]);

//             if ($request->hasFile('cover_photos')) {
//                 $coverPhotos = [];
//                 foreach ($request->file('cover_photos') as $file) {
//                     if ($file->getSize() > 1024 * 1024) {
//                         return back()->withErrors(['cover_photos' => 'Each file must not exceed 1MB']);
//                     }
//                     $filename = date('Y-m-d') . "_" . Str::random(14) . "_" . $file->getClientOriginalName();
//                     $file->move(public_path('uploads/coverPhotos'), $filename);
//                     $coverPhotos[] = $filename;
//                 }
//                 // Delete old files if needed
//                 if ($gallery->cover_photos) {
//                     foreach (json_decode($gallery->cover_photos) as $oldFile) {
//                         if (file_exists(public_path('uploads/coverPhotos/' . $oldFile))) {
//                             unlink(public_path('uploads/coverPhotos/' . $oldFile));
//                         }
//                     }
//                 }
//                 $data['cover_photos'] = json_encode($coverPhotos);
//             }

//             if ($request->hasFile('upload_videos')) {
//                 $videos = [];
//                 foreach ($request->file('upload_videos') as $file) {
//                     if ($file->getSize() > 10 * 1024 * 1024) {
//                         return back()->withErrors(['upload_videos' => 'Each video must not exceed 10MB']);
//                     }
//                     $filename = date('Y-m-d') . "_" . Str::random(14) . "_" . $file->getClientOriginalName();
//                     $file->move(public_path('uploads/galleryVideos'), $filename);
//                     $videos[] = $filename;
//                 }
//                 // Delete old videos if needed
//                 if ($gallery->upload_videos) {
//                     foreach (json_decode($gallery->upload_videos) as $oldVideo) {
//                         if (file_exists(public_path('uploads/galleryVideos/' . $oldVideo))) {
//                             unlink(public_path('uploads/galleryVideos/' . $oldVideo));
//                         }
//                     }
//                 }
//                 $data['upload_videos'] = json_encode($videos);
//             }


//             // Update gallery via service
//             $this->galleryService->update($data, $id);

//             return redirect()->route('galleries.index')->with('success', 'Gallery updated successfully.');

//         } catch (\Exception $e) {
//             return back()->withErrors(['error' => $e->getMessage()]);
//         }
//     }


//     public function destroy($id)
//     {
//         // dd($id);
//         $this->galleryService->delete($id);
//         return redirect()->route('galleries.index')->with('success', 'Gallery deleted successfully.');
//     }

//     public function show(Gallery $gallery)
//     {
//         return view('admin.galleries.show', compact('gallery'));
//     }
// }





namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\GalleryRequest;
use App\Http\Requests\Admin\UpdateGalleryRequest;
use App\Services\GalleryService;
use App\Services\BrandService;
use App\Services\VariantService;
use App\Services\ColorService;
use App\Services\FuelTypeService;
use App\Models\Gallery;
use App\Services\OEMService;
use Illuminate\Support\Str;

class GalleryController extends Controller
{
    protected $galleryService;
    protected $brandService;
    protected $variantService;
    protected $colorService;
    protected $fuelTypeService;

    public function __construct(
        GalleryService $galleryService,
        BrandService $brandService,
        VariantService $variantService,
        ColorService $colorService,
        FuelTypeService $fuelTypeService,
        // OEMService $oemService
    ) {
        $this->galleryService = $galleryService;
        $this->brandService = $brandService;
        $this->variantService = $variantService;
        $this->colorService = $colorService;
        $this->fuelTypeService = $fuelTypeService;
        // $this->oemService = $oemService;
    }

    public function index()
    {
        $galleries = $this->galleryService->getAll();
        return view('admin.galleries.index', compact('galleries'));
    }

    public function create()
    {
        $brands = $this->brandService->getAll();
        $variants = $this->variantService->getAll();
        $colors = $this->colorService->getAll();
        $fuelTypes = $this->fuelTypeService->getAll();

        // $oems = $this->oemService->getAll(); // fetch all OEMs
        return view('admin.galleries.create', compact('brands', 'variants', 'colors', 'fuelTypes'));
    }

    public function store(GalleryRequest $request)
    {
        try {
            $data = $request->only(['brand_id', 'variant_id', 'color_id', 'fuel_type_id']);

            // Handle cover photos
            if ($request->hasFile('cover_photos')) {
                $coverPhotos = [];
                foreach ($request->file('cover_photos') as $file) {
                    $filename = date('Y-m-d') . '_' . Str::random(14) . '_' . $file->getClientOriginalName();
                    $file->move(public_path('uploads/coverPhotos'), $filename);
                    $coverPhotos[] = $filename;
                }
                $data['cover_photos'] = json_encode($coverPhotos);
            }

            // Handle videos
            if ($request->hasFile('upload_videos')) {
                $videos = [];
                foreach ($request->file('upload_videos') as $file) {
                    $filename = date('Y-m-d') . '_' . Str::random(14) . '_' . $file->getClientOriginalName();
                    $file->move(public_path('uploads/galleryVideos'), $filename);
                    $videos[] = $filename;
                }
                $data['upload_videos'] = json_encode($videos);
            }

            $this->galleryService->create($data);

            return redirect()->route('galleries.index')->with('success', 'Gallery created successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }



    public function edit(Gallery $gallery)
    {
        $brands = $this->brandService->getAll();
        $variants = $this->variantService->getAll();
        $colors = $this->colorService->getAll();
        $fuelTypes = $this->fuelTypeService->getAll();
        // $oems = $this->oemService->getAll(); // ← Add this

        return view('admin.galleries.edit', compact('gallery', 'brands', 'variants', 'colors', 'fuelTypes'));
    }



    public function update(UpdateGalleryRequest $request, $id)
    {
        try {
            $gallery = Gallery::findOrFail($id);

            $data = $request->only(['brand_id', 'variant_id', 'color_id', 'fuel_type_id']);

            // Decode existing cover photos
            $existingPhotos = is_array($gallery->cover_photos)
                ? $gallery->cover_photos
                : json_decode($gallery->cover_photos, true) ?? [];

            // Remove selected photos
            if ($request->has('remove_photos')) {
                foreach ($request->remove_photos as $remove) {
                    $path = public_path('uploads/coverPhotos/' . $remove);
                    if (file_exists($path)) {
                        @unlink($path);
                    }
                }
                $existingPhotos = array_diff($existingPhotos, $request->remove_photos);
            }

            // Add new photos
            if ($request->hasFile('cover_photos')) {
                foreach ($request->file('cover_photos') as $file) {
                    $filename = date('Y-m-d') . '_' . Str::random(14) . '_' . $file->getClientOriginalName();
                    $file->move(public_path('uploads/coverPhotos'), $filename);
                    $existingPhotos[] = $filename;
                }
            }

            // Save final list
            $data['cover_photos'] = array_values($existingPhotos);

            // ✅ Repeat same logic for videos if needed
            $existingVideos = is_array($gallery->upload_videos)
                ? $gallery->upload_videos
                : json_decode($gallery->upload_videos, true) ?? [];

            if ($request->has('remove_videos')) {
                foreach ($request->remove_videos as $remove) {
                    $path = public_path('uploads/galleryVideos/' . $remove);
                    if (file_exists($path)) {
                        @unlink($path);
                    }
                }
                $existingVideos = array_diff($existingVideos, $request->remove_videos);
            }

            if ($request->hasFile('upload_videos')) {
                foreach ($request->file('upload_videos') as $file) {
                    $filename = date('Y-m-d') . '_' . Str::random(14) . '_' . $file->getClientOriginalName();
                    $file->move(public_path('uploads/galleryVideos'), $filename);
                    $existingVideos[] = $filename;
                }
            }

            $data['upload_videos'] = array_values($existingVideos);

            // Update using service
            $this->galleryService->update($data, $id);

            // $oems = $this->oemService->getAll();
            return redirect()->route('galleries.index')->with('success', 'Gallery updated successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        $this->galleryService->delete($id);
        return redirect()->route('galleries.index')->with(
            'success',
            'Gallery deleted successfully.'
        );
    }

    public function show(Gallery $gallery)
    {
        return view('admin.galleries.show', compact('gallery'));
    }
}
