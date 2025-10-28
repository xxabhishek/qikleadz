<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\FeatureRequest;
use App\Http\Requests\Admin\UpdateFeatureRequest;
use App\Services\FeatureService;
use App\Services\BrandService;
use App\Services\VariantService;
use App\Models\Feature;
use Illuminate\Http\Request;

class FeatureApiController extends Controller
{
    protected $featureService;
    protected $brandService;
    protected $variantService;

    public function __construct(
        FeatureService $featureService,
        BrandService $brandService,
        VariantService $variantService
    ) {
        $this->featureService = $featureService;
        $this->brandService = $brandService;
        $this->variantService = $variantService;
    }

    // GET /api/features
    public function index()
    {
        $features = Feature::with(['brand', 'variant'])
            ->orderBy('brand_id')
            ->orderBy('variant_id')
            ->get()
            ->groupBy(fn($item) => $item->brand_id . '-' . $item->variant_id);

        return response()->json($features, 200);
    }

    // POST /api/features
    public function store(FeatureRequest $request)
    {
        $brandId = $request->brand_id;
        $variantId = $request->variant_id;

        $created = [];
        foreach ($request->titles as $index => $title) {
            $description = $request->descriptions[$index] ?? null;

            $feature = Feature::create([
                'brand_id' => $brandId,
                'variant_id' => $variantId,
                'title' => $title,
                'description' => $description,
            ]);

            $created[] = $feature;
        }

        return response()->json([
            'message' => 'Features created successfully',
            'data' => $created
        ], 201);
    }

    // GET /api/features/{id}
    public function show($id)
    {
        $firstFeature = Feature::findOrFail($id);

        $features = Feature::where('brand_id', $firstFeature->brand_id)
            ->where('variant_id', $firstFeature->variant_id)
            ->get();

        return response()->json([
            'brand' => $this->brandService->getById($firstFeature->brand_id),
            'variant' => $this->variantService->getById($firstFeature->variant_id),
            'features' => $features
        ], 200);
    }

    // PUT /api/features/{id}
    public function update(UpdateFeatureRequest $request, $id)
    {
        $feature = Feature::findOrFail($id);

        // Update parent
        $feature->update([
            'brand_id' => $request->brand_id,
            'variant_id' => $request->variant_id,
        ]);

        // Delete removed features
        if ($request->filled('delete_ids')) {
            Feature::whereIn('id', $request->delete_ids)->delete();
        }

        // Update or create features
        $titles = $request->titles ?? [];
        $descriptions = $request->descriptions ?? [];
        $featureIds = $request->feature_ids ?? [];

        $updated = [];
        foreach ($titles as $index => $title) {
            $description = $descriptions[$index] ?? null;
            $featureId = $featureIds[$index] ?? null;

            if ($featureId) {
                $child = Feature::find($featureId);
                if ($child) {
                    $child->update([
                        'title' => $title,
                        'description' => $description,
                        'brand_id' => $request->brand_id,
                        'variant_id' => $request->variant_id,
                    ]);
                    $updated[] = $child;
                }
            } else {
                $newFeature = Feature::create([
                    'title' => $title,
                    'description' => $description,
                    'brand_id' => $request->brand_id,
                    'variant_id' => $request->variant_id,
                ]);
                $updated[] = $newFeature;
            }
        }

        return response()->json([
            'message' => 'Features updated successfully',
            'data' => $updated
        ], 200);
    }

    // DELETE /api/features/{id}
    public function destroy($id)
    {
        try {
            $this->featureService->delete($id);
            return response()->json(['message' => 'Feature deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}
