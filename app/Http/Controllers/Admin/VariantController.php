<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\VariantRequest;
use App\Http\Requests\Admin\UpdateVariantRequest;
use App\Models\Brand;
use App\Models\Variant;
use App\Services\VariantService;
use App\Services\BrandService;
use App\Services\FuelTypeService;
use App\Services\ColorService;
use App\Services\TransmissionService;
use App\Services\CCService;
use App\Services\VehicleUsageService;
use App\Services\CountryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
class VariantController extends Controller
{
    /** @var VariantService */
    protected $variantService;

    /**  @var BrandService */
    Protected $brandService;

    /**  @var FuelTypeService  */
    protected $fuelTypeService;

    /**  @var ColorService  */
    protected $colorService;

    /**  @var TransmissionService  */
    protected $transmissionService;

    /**  @var CCService  */
    protected $ccService;


    /**  @var VehicleUsageService  */
    protected $vehicleUsageService;

    /**  @var CountryService  */
    protected $countryService;






        /**
     * VariantController constructor.
     * @param TransmissionService $transmissionService
     */

    public function __construct(
        VariantService $variantService,
        BrandService $brandService,
        FuelTypeService $fuelTypeService,
        ColorService $colorService,
        TransmissionService $transmissionService,
        CCService $ccService,
        VehicleUsageService $vehicleUsageService,
        CountryService $countryService


        )
    {
        $this->middleware('auth');
        $this->variantService = $variantService;
        $this->brandService =$brandService ;
        $this->fuelTypeService =$fuelTypeService;
        $this->colorService =$colorService;
        $this->transmissionService =$transmissionService;
        $this->ccService =$ccService;
        $this->vehicleUsageService =$vehicleUsageService;
        $this->countryService =$countryService;


    }

    public function index(Request $request)
    {
        $variants = $this->variantService->getAll();
        $brands= $this->brandService->getAll();
        $fuelTypes =$this->fuelTypeService->getAll();
        return view('admin.variants.index', compact('variants','brands','fuelTypes'));
    }

    public function create()
    {
        // Assuming a Model model exists; fetch models for the dropdown
        $models = Brand::all(); // Adjust if Model model has a different namespace
        $brands= $this->brandService->getAll();
        $fuelTypes =$this->fuelTypeService->getAll();
        $colors =$this->colorService->getAll();
        $transmissions= $this->transmissionService->getAll();
        $ccs= $this->ccService->getAll();
        $vehicleUsages= $this->vehicleUsageService->getAll();
        $countries = $this->countryService->getAll();

        return view('admin.variants.create', compact('models','brands','fuelTypes','colors','transmissions','ccs','vehicleUsages','countries'));
    }

    public function store(VariantRequest $request)
    {
        $data = $request->all();

        // if ($request->has('color_id')) {
        //     $data['color_id'] = implode(',', $request->color_id);
        // }

        // Handle brochure upload
    if ($request->hasFile('brochure')) {
        $file = $request->file('brochure');

        // validate file size <= 2MB
        if ($file->getSize() > 2097152) { // 2MB
            return back()->withErrors(['brochure' => 'File size must not exceed 2MB']);
        }

        $filename = date('Y-m-d') . "_" . Str::random(14) . "_" . $file->getClientOriginalName();
        $file->move(public_path('uploads/brochures'), $filename);
        $data['brochure'] = $filename;
    }
    // dd($data);
        $this->variantService->create($data);
        return redirect()->route('variants.index')
            ->with('success', 'Variant created successfully');
    }


    public function edit($id)
    {
        $variants = $this->variantService->getById($id);
        $brands= $this->brandService->getAll();
        $fuelTypes =$this->fuelTypeService->getAll();
        $colors =$this->colorService->getAll();
        $transmissions= $this->transmissionService->getAll();
        $ccs= $this->ccService->getAll();
        $vehicleUsages= $this->vehicleUsageService->getAll();
        $countries = $this->countryService->getAll();
        // dd($colors,$variants);

        return view('admin.variants.edit', compact('variants', 'brands','fuelTypes','colors','transmissions','ccs','vehicleUsages','countries'));
    }


        /**
     * @param UpdateVariantRequest $request
     * @param $id
     * @return mixed
     */

    public function update(UpdateVariantRequest $request, $id)
    {
        $data = $request->all();

        $variantEntry = Variant::findOrFail($id);


// Handle brochure update
    if ($request->hasFile('brochure')) {
        $file = $request->file('brochure');

        // validate file size <= 2MB
        if ($file->getSize() > 2097152) {
            return back()->withErrors(['brochure' => 'File size must not exceed 2MB']);
        }

        // Delete old file
        $oldPath = public_path('uploads/brochures/' . $variantEntry->brochure);
        if ($variantEntry->brochure && File::exists($oldPath)) {
            File::delete($oldPath);
        }

        $filename = date('Y-m-d') . "_" . Str::random(14) . "_" . $file->getClientOriginalName();
        $file->move(public_path('uploads/brochures'), $filename);
        $data['brochure'] = $filename;


    }
    // dd($data);

            $this->variantService->update($data, $id);

        return redirect()->route('variants.index')
            ->with('success', 'Variant updated successfully');
    }

   public function show($id)
{
    $variant = $this->variantService->getById($id);

    // Convert color IDs to names
    $variant->colorNames = [];
    if ($variant->color_id) {
        $colorIds = explode(',', $variant->color_id);
        $variant->colorNames = \App\Models\Color::whereIn('id', $colorIds)->pluck('name')->toArray();
    }

    return view('admin.variants.show', compact('variant'));
}


    public function destroy($id)
    {
        $this->variantService->delete($id);
        return redirect()->route('variants.index')
            ->with('success', 'Variant deleted successfully');
    }
}
