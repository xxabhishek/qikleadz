<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\BrandRequest;
use App\Http\Requests\Admin\UpdateBrandRequest;
use App\Models\Brand;
use App\Services\BrandService;

class BrandApiController extends Controller
{
    protected $brandService;

    public function __construct(BrandService $brandService)
    {
        $this->brandService = $brandService;
    }
    public function index()
    {
        // dd($request->all());
        $brands = $this->brandService->getAll();
        // dd($brands);
        return response()->json([
            'success' => true,
            'data' => $brands
        ], 200);
    }

    public function store(BrandRequest $request)
    {
        // dd($request->all());
        $brand = $this->brandService->create($request->validated());
        // dd($brands);
        return response()->json([
            'success' => true,
            'message' => 'Brand created successfully.',
            'data' => $brand
        ], 201);
    }

    public function show($id)
    {
        $brand = Brand::find($id);

        if (!$brand) {
            return response()->json([
                'success' => false,
                'message' => 'Brand not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $brand
        ], 200);
    }

    public function update(UpdateBrandRequest $request, $id)
    {
        $brand = $this->brandService->update($request->validated(), $id);

        return response()->json([
            'success' => true,
            'message' => 'Brand updated successfully.',
            'data' => $brand
        ], 200);
    }

    public function destroy($id)
    {
        $deleted = $this->brandService->delete($id);

        if (!$deleted) {
            return response()->json([
                'success' => false,
                'message' => 'Brand not found or not deleted'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Brand deleted successfully.'
        ], 200);
    }
}
