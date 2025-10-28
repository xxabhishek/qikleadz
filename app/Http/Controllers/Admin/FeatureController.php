<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\UpdateFeatureRequest;
use App\Http\Requests\Admin\FeatureRequest;
use App\Services\FeatureService;
use App\Services\BrandService;
use App\Services\VariantService;

use Illuminate\Contracts\View\Factory;
use Illuminate\Http\Response;
use Illuminate\View\View;
use App\Http\Controllers\Controller;
use App\Models\Feature;
use File;
use Illuminate\Support\Str;
class FeatureController extends Controller
{
    /** @var FeatureService */
    protected $featureService;

        /** @var BrandService */
    protected $brandService;

            /** @var VariantService */
    protected $variantService;



    /**
     * FeatureController constructor.
     * @param FeatureService $featureService
     */
    public function __construct(
        FeatureService $featureService,
        BrandService $brandService,
        VariantService $variantService
    ) {
        $this->middleware('auth');
        $this->featureService = $featureService;
        $this->brandService = $brandService;
        $this->variantService =$variantService;

    }

    /**
     * @param FeatureDataTable $dataTable
     * @return mixed
     */
    // public function index()
    // {
    //     $features = $this->featureService->getAll();
    //     return view('admin.feature.index', compact('features'));
    // }


    public function index()
{
    $features = Feature::with(['brand', 'variant'])
        ->orderBy('brand_id')
        ->orderBy('variant_id')
        ->get()
        ->groupBy(function ($item) {
            return $item->brand_id . '-' . $item->variant_id;
        });

    return view('admin.feature.index', compact('features'));
}


    /**
     * Show the form for creating new Role.
     *
     * @return Response
     */
    public function create()
    {
        $countries = $this->featureService->getAll();
        $brands =$this->brandService->getAll();
        $variants=$this->variantService->getAll();
        return view('admin.feature.create', compact('countries','brands','variants'));
    }

    /**
     * @param FeatureRequest $request
     * @return mixed
     */

    public function store(FeatureRequest $request)
{
    $brandId   = $request->brand_id;
    $variantId = $request->variant_id;

    foreach ($request->titles as $index => $title) {
        $description = $request->descriptions[$index] ?? null;

        Feature::create([
            'brand_id'    => $brandId,
            'variant_id'  => $variantId,
            'title'       => $title,
            'description' => $description,
        ]);
    }

    return redirect()->route('feature.index')->with('success', 'Features added successfully!');
}



    /**
     * @param Feature $feature
     * @return mixed
     */

    // public function edit($id)
    // {
    //     // dd('edit Feature');
    //     $features = Feature::findOrFail($id);
    //     $countries = $this->featureService->getAll();
    //     $brands =$this->brandService->getAll();
    //     $variants=$this->variantService->getAll();
    //     // dd($variants,$brands);

    //     return view('admin.feature.edit', compact('features','countries','brands','variants'));
    // }


    /**
 * Show the form for editing features under one brand + variant.
 */
public function edit($id)
{
    // Get the first feature record
    $feature = Feature::findOrFail($id);

    // Fetch all features for the same brand + variant
    $features = Feature::where('brand_id', $feature->brand_id)
        ->where('variant_id', $feature->variant_id)
        ->get();

    $brands   = $this->brandService->getAll();
    $variants = $this->variantService->getAll();

    return view('admin.feature.edit', compact('features', 'brands', 'variants', 'feature'));
}



    /**
     * @param UpdateFeatureRequest $request
     * @param $id
     * @return mixed
     */
    // public function update(UpdateFeatureRequest $request, int $id)
    // {
    //     $data = $request->all();
    //     $this->featureService->update($data, $id);
    //     return redirect()->route('feature.index')
    //         ->with('success', 'feature updated successfully');
    // }

    public function update(UpdateFeatureRequest $request, int $id)
{
    // 1. Update parent feature record (brand_id, variant_id)
    $feature = Feature::findOrFail($id);
    $feature->update([
        'brand_id'   => $request->brand_id,
        'variant_id' => $request->variant_id,
    ]);

    // 2. Handle deletions (if any)
    if ($request->filled('delete_ids')) {
        Feature::whereIn('id', $request->delete_ids)->delete();
    }

    // 3. Update or create features based on feature_ids
    $titles       = $request->titles ?? [];
    $descriptions = $request->descriptions ?? [];
    $featureIds   = $request->feature_ids ?? [];

    foreach ($titles as $index => $title) {
        $description = $descriptions[$index] ?? null;
        $featureId   = $featureIds[$index] ?? null;

        if ($featureId) {
            // Update existing
            $child = Feature::find($featureId);
            if ($child) {
                $child->update([
                    'title'       => $title,
                    'description' => $description,
                    'brand_id'    => $request->brand_id,
                    'variant_id'  => $request->variant_id,
                ]);
            }
        } else {
            // Create new
            Feature::create([
                'title'       => $title,
                'description' => $description,
                'brand_id'    => $request->brand_id,
                'variant_id'  => $request->variant_id,
            ]);
        }
    }

    return redirect()->route('feature.index')
        ->with('success', 'Feature updated successfully.');
}


    public function show($id)
{
    $firstFeature = Feature::findOrFail($id);

    $features = Feature::where('brand_id', $firstFeature->brand_id)
        ->where('variant_id', $firstFeature->variant_id)
        ->get();

    $brand = $this->brandService->getById($firstFeature->brand_id);
    $variant = $this->variantService->getById($firstFeature->variant_id);

    return view('admin.feature.show', compact('features', 'brand', 'variant'));
}



    public function destroy($id)
    {
        try {
            $this->featureService->delete($id);
            return redirect()->route('feature.index')
                ->with('success', 'feature deleted successfully');
        } catch (\Exception $e) {
            return redirect()->route('feature.index')
                ->with('error', $e->getMessage());
        }
    }
}