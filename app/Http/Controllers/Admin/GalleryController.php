<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\GalleryRequest;
use App\Services\GalleryService;
use App\Services\BrandService;
use App\Services\VariantService;
use App\Services\ColorService;
use App\Services\FuelTypeService;
use App\Models\Gallery;

class GalleryController extends Controller
{
    protected $service;
    protected $brandService;
    protected $variantService;
    protected $colorService;
    protected $fuelTypeService;

    public function __construct(
        GalleryService $service,
        BrandService $brandService,
        VariantService $variantService,
        ColorService $colorService,
        FuelTypeService $fuelTypeService
    ) {
        $this->service = $service;
        $this->brandService = $brandService;
        $this->variantService = $variantService;
        $this->colorService = $colorService;
        $this->fuelTypeService = $fuelTypeService;
    }

    public function index()
    {
        $galleries = $this->service->list();
        return view('admin.galleries.index', compact('galleries'));
    }

    public function create()
    {
        $brands = $this->brandService->getAll();
        $variants = $this->variantService->getAll();
        $colors = $this->colorService->getAll();
        $fuelTypes = $this->fuelTypeService->getAll();

        return view('admin.galleries.create', compact('brands', 'variants', 'colors', 'fuelTypes'));
    }

    public function store(GalleryRequest $request)
    {
        try {
            $this->service->store($request->validated());
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

        return view('admin.galleries.edit', compact('gallery', 'brands', 'variants', 'colors', 'fuelTypes'));
    }

    public function update(GalleryRequest $request, Gallery $gallery)
    {
        try {
            $this->service->update($gallery, $request->validated());
            return redirect()->route('galleries.index')->with('success', 'Gallery updated successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function destroy(Gallery $gallery)
    {
        $this->service->delete($gallery);
        return redirect()->route('galleries.index')->with('success', 'Gallery deleted successfully.');
    }
}