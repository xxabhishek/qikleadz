<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\TechSpecRequest;
use App\Http\Requests\Admin\UpdateTechSpecRequest;
use App\Services\TechSpecService;
use App\Services\BrandService;
use App\Services\VariantService;
use App\Models\TechSpec;
use Illuminate\Http\Request;

class TechSpecApiController extends Controller
{
    protected $techSpecService;
    protected $brandService;
    protected $variantService;

    public function __construct(
        TechSpecService $techSpecService,
        BrandService $brandService,
        VariantService $variantService
    ) {
        $this->techSpecService = $techSpecService;
        $this->brandService = $brandService;
        $this->variantService = $variantService;
    }

    // GET /api/tech-specs
    public function index()
    {
        $techSpecs = TechSpec::with(['brand', 'variant'])
            ->orderBy('brand_id')
            ->orderBy('variant_id')
            ->get()
            ->groupBy(fn($item) => $item->brand_id . '-' . $item->variant_id);

        return response()->json($techSpecs, 200);
    }

    // POST /api/tech-specs
    public function store(TechSpecRequest $request)
    {
        $brandId = $request->brand_id;
        $variantId = $request->variant_id;
        $created = [];

        foreach ($request->titles as $index => $title) {
            $description = $request->descriptions[$index] ?? null;
            $created[] = TechSpec::create([
                'brand_id' => $brandId,
                'variant_id' => $variantId,
                'title' => $title,
                'description' => $description,
            ]);
        }

        return response()->json([
            'message' => 'TechSpec(s) created successfully',
            'data' => $created
        ], 201);
    }

    // GET /api/tech-specs/{id}
    public function show($id)
    {
        $firstTech = TechSpec::find($id);

        if (!$firstTech) {
            return response()->json(['message' => 'TechSpec not found'], 404);
        }

        $techSpecs = TechSpec::where('brand_id', $firstTech->brand_id)
            ->where('variant_id', $firstTech->variant_id)
            ->get();

        return response()->json([
            'brand' => $this->brandService->getById($firstTech->brand_id),
            'variant' => $this->variantService->getById($firstTech->variant_id),
            'techSpecs' => $techSpecs
        ], 200);
    }

    // PUT /api/tech-specs/{id}
    public function update(UpdateTechSpecRequest $request, $id)
    {
        $techspec = TechSpec::find($id);
        if (!$techspec) {
            return response()->json(['message' => 'TechSpec not found'], 404);
        }

        // update parent record
        $techspec->update([
            'brand_id' => $request->brand_id,
            'variant_id' => $request->variant_id,
        ]);

        // handle deletions
        if ($request->filled('delete_ids')) {
            TechSpec::whereIn('id', $request->delete_ids)->delete();
        }

        // update or create features
        $titles = $request->titles ?? [];
        $descriptions = $request->descriptions ?? [];
        $featureIds = $request->techSpec_ids ?? [];
        $updatedOrCreated = [];

        foreach ($titles as $index => $title) {
            $description = $descriptions[$index] ?? null;
            $featureId = $featureIds[$index] ?? null;

            if ($featureId) {
                $child = TechSpec::find($featureId);
                if ($child) {
                    $child->update([
                        'title' => $title,
                        'description' => $description,
                        'brand_id' => $request->brand_id,
                        'variant_id' => $request->variant_id,
                    ]);
                    $updatedOrCreated[] = $child;
                }
            } else {
                $updatedOrCreated[] = TechSpec::create([
                    'title' => $title,
                    'description' => $description,
                    'brand_id' => $request->brand_id,
                    'variant_id' => $request->variant_id,
                ]);
            }
        }

        return response()->json([
            'message' => 'TechSpec updated successfully',
            'data' => $updatedOrCreated
        ], 200);
    }

    // DELETE /api/tech-specs/{id}
    public function destroy($id)
    {
        $techSpec = TechSpec::find($id);
        if (!$techSpec) {
            return response()->json(['message' => 'TechSpec not found'], 404);
        }

        try {
            $this->techSpecService->delete($id);
            return response()->json(['message' => 'TechSpec deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}
