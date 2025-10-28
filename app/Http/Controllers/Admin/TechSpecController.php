<?php

namespace App\Http\Controllers\Admin;


use App\Http\Requests\Admin\UpdateTechSpecRequest;
use App\Http\Requests\Admin\TechSpecRequest;
use App\Services\TechSpecService;
use App\Services\BrandService;
use App\Services\VariantService;
use Illuminate\Contracts\View\Factory;
use Illuminate\Http\Response;
use Illuminate\View\View;
use App\Http\Controllers\Controller;
use App\Models\TechSpec;
use File;
use Illuminate\Support\Str;
class TechSpecController extends Controller
{
    /** @var TechSpecService */
    protected $techSpecService;

    /** @var BrandService */
    protected $brandService;

    /** @var VariantService */
    protected $variantService;


    /**
     * CountryController constructor.
     * @param TechSpecService $techSpecService
     */
    public function __construct(
        TechSpecService $techSpecService,
        BrandService $brandService,
        VariantService $variantService

    ) {
        $this->middleware('auth');
        $this->techSpecService = $techSpecService;
        $this->brandService = $brandService;
        $this->variantService = $variantService;

    }

    /**
     * @param TechSpecDataTable $dataTable
     * @return mixed
     */
    // public function index()
    // {
    //     $techSpecs = $this->techSpecService->getAll();
    //     return view('admin.tech-spec.index', compact('techSpecs'));
    // }

    public function index()
    {
        // $techSpecs = TechSpec::with(['brand', 'variant'])
        //     ->orderBy('brand_id')
        //     ->orderBy('variant_id')
        //     ->get()
        //     ->groupBy(function ($item) {
        //         return $item->brand_id . '-' . $item->variant_id;
        //     });

        // $techSpecs = TechSpec::with(['brand', 'variant'])
        // ->orderBy('brand_id')
        // ->orderBy('variant_id')
        // ->get();


        $techSpecs = TechSpec::with(['brand', 'variant'])
            ->orderBy('brand_id')
            ->orderBy('variant_id')
            ->get()
            ->groupBy(function ($item) {
                return $item->brand_id . '-' . $item->variant_id;
            });




        return view('admin.tech-spec.index', compact('techSpecs'));
    }


    /**
     * Show the form for creating new Role.
     *
     * @return Response
     */
    public function create()
    {
        $techSpecs = $this->techSpecService->getAll();
        $brands = $this->brandService->getAll();
        $variants = $this->variantService->getAll();

        return view('admin.tech-spec.create', compact('techSpecs', 'brands', 'variants'));
    }

    /**
     * @param TechSpecRequest $request
     * @return mixed
     */
    public function store(TechSpecRequest $request)
    {
        // $data = $request->all();
        // $result = $this->techSpecService->create($data);

        $brandId = $request->brand_id;
        $variantId = $request->variant_id;

        foreach ($request->titles as $index => $title) {
            $description = $request->descriptions[$index] ?? null;

            TechSpec::create([
                'brand_id' => $brandId,
                'variant_id' => $variantId,
                'title' => $title,
                'description' => $description,
            ]);

        }

        return redirect()->route('tech-spec.index')
            ->with('success', 'tech-spec created successfully');
    }


    /**
     * @param TechSpec $techSpec
     * @return mixed
     */

    // public function edit($id)
    // {
    //     $techSpecs = TechSpec::findOrFail($id);
    //             $brands =$this->brandService->getAll();
    //     $variants=$this->variantService->getAll();

    //     return view('admin.tech-spec.edit', compact('techSpecs','brands','variants'));
    // }

    public function edit($id)
    {
        // Get the first feature record
        $techSpec = TechSpec::findOrFail($id);

        // Fetch all features for the same brand + variant
        $techSpecs = TechSpec::where('brand_id', $techSpec->brand_id)
            ->where('variant_id', $techSpec->variant_id)
            ->get();

        $brands = $this->brandService->getAll();
        $variants = $this->variantService->getAll();

        return view('admin.tech-spec.edit', compact('techSpecs', 'brands', 'variants', 'techSpec'));
    }



    /**
     * @param UpdateTechSpecRequest $request
     * @param $id
     * @return mixed
     */
    // public function update(UpdateTechSpecRequest $request, int $id)
    // {
    //     $data = $request->all();
    //     if ($request->hasFile('flag1')) {
    //         $filepath = public_path('/uploads/flags/' . $request->flag);

    //         if (File::exists($filepath)) {
    //             File::delete($filepath);
    //         }
    //         $file = $request->file('flag1');
    //         $imagename = date('Y-m-d') . "_" . Str::random(14) . "_" . $file->getClientOriginalName();
    //         $file->move(public_path('/uploads/flags'), $imagename);
    //         $data['flag'] = $imagename;
    //     }
    //     $this->techSpecService->update($data, $id);
    //     return redirect()->route('tech-spec.index')
    //         ->with('success', 'tech-spec updated successfully');
    // }


    public function update(UpdateTechSpecRequest $request, int $id)
    {
        // 1. Update parent feature record (brand_id, variant_id)
        $techspec = TechSpec::findOrFail($id);
        $techspec->update([
            'brand_id' => $request->brand_id,
            'variant_id' => $request->variant_id,
        ]);

        // 2. Handle deletions (if any)
        if ($request->filled('delete_ids')) {
            TechSpec::whereIn('id', $request->delete_ids)->delete();
        }

        // 3. Update or create features based on feature_ids
        $titles = $request->titles ?? [];
        $descriptions = $request->descriptions ?? [];
        $featureIds = $request->techSpec_ids ?? [];

        foreach ($titles as $index => $title) {
            $description = $descriptions[$index] ?? null;
            $featureId = $featureIds[$index] ?? null;

            if ($featureId) {
                // Update existing
                $child = TechSpec::find($featureId);
                if ($child) {
                    $child->update([
                        'title' => $title,
                        'description' => $description,
                        'brand_id' => $request->brand_id,
                        'variant_id' => $request->variant_id,
                    ]);
                }
            } else {
                // Create new
                TechSpec::create([
                    'title' => $title,
                    'description' => $description,
                    'brand_id' => $request->brand_id,
                    'variant_id' => $request->variant_id,
                ]);
            }
        }

        return redirect()->route('tech-spec.index')
            ->with('success', 'TechSpec updated successfully.');
    }



    public function show($id)
    {
        $firstTech = TechSpec::findOrFail($id);

        $techSpecs = TechSpec::where('brand_id', $firstTech->brand_id)
            ->where('variant_id', $firstTech->variant_id)
            ->get();

        $brand = $this->brandService->getById($firstTech->brand_id);
        $variant = $this->variantService->getById($firstTech->variant_id);

        return view('admin.tech-spec.show', compact('techSpecs', 'brand', 'variant'));
    }


    public function destroy($id)
    {
        try {
            $this->techSpecService->delete($id);
            return redirect()->route('tech-spec.index')
                ->with('success', 'techSpec deleted successfully');
        } catch (\Exception $e) {
            return redirect()->route('tech-spec.index')
                ->with('error', $e->getMessage());
        }
    }
}