<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ColorRequest;
use App\Http\Requests\Admin\UpdateColorRequest;
use App\Services\ColorService;
use App\Services\BrandService;
use App\Services\VariantService;
use App\Services\CountryService;
use App\Models\Color;
use Illuminate\Http\Request;

class ColorApiController extends Controller
{
    protected $colorService;
    protected $brandService;
    protected $variantService;
    protected $countryService;

    public function __construct(
        ColorService $colorService,
        BrandService $brandService,
        VariantService $variantService,
        CountryService $countryService
    ) {
        $this->colorService = $colorService;
        $this->brandService = $brandService;
        $this->variantService = $variantService;
        $this->countryService = $countryService;
    }

    /**
     * GET /api/colors
     * Fetch colors, optionally filtered by variant_id
     */
    public function index()
{
    try {
        $colors = Color::all();
        return response()->json([
            'success' => true,
            'data' => $colors
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => $e->getMessage()
        ], 500);
    }
}


    /**
     * POST /api/colors
     */
    public function store(ColorRequest $request)
    {
        $data = $request->validated();
        $color = $this->colorService->create($data);

        return response()->json([
            'status' => true,
            'message' => 'Color created successfully',
            'data' => $color
        ], 201);
    }

    /**
     * GET /api/colors/{id}
     */
    public function show($id)
    {
        $color = Color::find($id);

        if (!$color) {
            return response()->json([
                'status' => false,
                'message' => 'Color not found'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Color fetched successfully',
            'data' => $color
        ], 200);
    }

    /**
     * PUT /api/colors/{id}
     */
    public function update(UpdateColorRequest $request, $id)
    {
        $data = $request->validated();
        $color = $this->colorService->update($data, $id);

        if (!$color) {
            return response()->json([
                'status' => false,
                'message' => 'Color not found or update failed'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Color updated successfully',
            'data' => $color
        ], 200);
    }

    /**
     * DELETE /api/colors/{id}
     */
    public function destroy($id)
    {
        try {
            $deleted = $this->colorService->delete($id);

            if (!$deleted) {
                return response()->json([
                    'status' => false,
                    'message' => 'Color not found'
                ], 404);
            }

            return response()->json([
                'status' => true,
                'message' => 'Color deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to delete color',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
}
