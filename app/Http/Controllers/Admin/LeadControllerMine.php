<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\Admin\LeadRequest;

use App\Services\LeadService;
use App\Services\VehicleSegmentService;
use App\Services\FuelTypeService;
use App\Services\BrandService;
use App\Services\VariantService;
use App\Services\OEMService;

use App\Models\Lead;
use App\Models\LeadVehicle;
use App\Models\Variant;
use App\Models\Oem;
use App\Models\Brand;
use App\Models\FuelType;
use App\Models\Cc;
use App\Models\Gallery;
use App\Models\Color;
use App\Models\TechSpec;
use App\Models\VehicleSegment;
use Illuminate\Support\Facades\Validator;


use Auth;

class LeadControllerMine extends Controller
{
    protected $leadService;
    protected $vehicleSegmentService;
    protected $brandService;
    protected $fuelTypeService;
    protected $variantService;
    protected $oemService;

    public function __construct(
        LeadService $leadService,
        VehicleSegmentService $vehicleSegmentService,
        BrandService $brandService,
        FuelTypeService $fuelTypeService,
        VariantService $variantService,
        OEMService $oemService
    ) {
        $this->middleware('auth');

        $this->leadService = $leadService;
        $this->vehicleSegmentService = $vehicleSegmentService;
        $this->brandService = $brandService;
        $this->fuelTypeService = $fuelTypeService;
        $this->variantService = $variantService;
        $this->oemService = $oemService;
    }

    // Display all leads
    public function index(Request $request)
    {
        $segments = VehicleSegment::all();
        $brands = Brand::all();
        $variants = Variant::all();
        $fuelTypes = FuelType::all();
        $ccs = Cc::all();
        $galleries = Gallery::all();

        // Apply filters
        $filters = [
            'segment' => $request->input('segment', 'All'),
            'brand' => $request->input('brand', 'All'),
            'variant' => $request->input('variant', 'All'),
            'fuelType' => $request->input('fuelType', 'All'),
        ];

        $filteredVariants = $variants;

        if ($filters['segment'] !== 'All') {
            $filteredVariants = $filteredVariants->where('vehicle_segment_id', $filters['segment']);
        }
        if ($filters['brand'] !== 'All') {
            $filteredVariants = $filteredVariants->where('brand_id', $filters['brand']);
        }
        if ($filters['variant'] !== 'All') {
            $filteredVariants = $filteredVariants->where('id', $filters['variant']);
        }
        if ($filters['fuelType'] !== 'All') {
            $filteredVariants = $filteredVariants->where('fuel_type_id', $filters['fuelType']);
        }

        // Group variants by brand
        $groupedVariants = $filteredVariants->groupBy('brand_id')->map(function ($variants, $brandId) use ($brands) {
            return [
                'brand_id' => $brandId,
                'brand_name' => $brands->find($brandId)->name ?? 'Unknown',
                'variants' => $variants,
            ];
        })->values();

        return view('admin.leadgen.index', compact('segments', 'brands', 'variants', 'fuelTypes', 'ccs', 'galleries', 'filters', 'groupedVariants'));
    }

    /**
     * Display model details for a variant.
     *
     * @param int $variantId
     * @return \Illuminate\View\View
     */
    public function modelDetails(Request $request, $variantId)
    {
        $variant = Variant::findOrFail($variantId);
        $galleries = Gallery::where('variant_id', $variantId)->get();
        $brands = Brand::all();
        $fuelTypes = FuelType::all();
        $ccs = Cc::all();
        $colors = Color::whereIn('id', explode(',', $variant->color_id ?? ''))->get();
        $techSpecs = TechSpec::where('brand_id', $variant->brand_id)
            ->where('variant_id', $variantId)
            ->get()
            ->map(function ($spec) {
                return [
                    'key' => $spec->title,
                    'value' => strip_tags($spec->description),
                ];
            })->toArray();

        // Add main specs
        array_unshift($techSpecs, [
            'key' => 'Brand',
            'value' => $brands->find($variant->brand_id)->name ?? $variant->brand_id,
        ], [
            'key' => 'CC',
            'value' => $ccs->find($variant->cc_id)->name ?? $variant->cc_id,
        ], [
            'key' => 'Fuel',
            'value' => $fuelTypes->find($variant->fuel_type_id)->name ?? $variant->fuel_type_id,
        ], [
            'key' => 'Price',
            'value' => $variant->basic_price ? '₹' . number_format($variant->basic_price) : 'Price on request',
        ]);

        return view('admin.leadgen.model_details', compact('variant', 'galleries', 'brands', 'fuelTypes', 'ccs', 'colors', 'techSpecs'));
    }

    /**
     * Show the form for creating a new lead.
     *
     * @param Request $request
     * @return \Illuminate\View\View
     */
    public function leadInformation(Request $request)
    {
        $variantId = $request->input('variant_id');
        $selectedColorId = $request->input('selected_color_id');
        $variant = $variantId ? Variant::findOrFail($variantId) : null;
        $oems = Oem::all();
        $leadId = session('lead_id');
        $lead = $leadId ? Lead::find($leadId) : null;
        $brands = Brand::all();
        $fuelTypes = FuelType::all();
        $ccs = Cc::all();
        $galleries = $variant ? Gallery::where('variant_id', $variantId)->get() : collect([]);

        // Load draft data if available
        $formData = session('draft_lead', [
            'customer_name' => '',
            'phone_number' => '',
            'customer_location' => '',
            'purchase_date' => '',
            'quantity' => 1,
            'payment_mode' => 'cash',
            'oem_id' => '',
            'notes' => '',
        ]);

        return view('admin.leadgen.lead_information', compact('variant', 'oems', 'lead', 'formData', 'brands', 'fuelTypes', 'ccs', 'galleries', 'selectedColorId'));
    }

    /**
     * Store a newly created lead in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'customer_name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
            'customer_location' => 'required|string|max:255',
            'purchase_date' => 'nullable|date',
            'quantity' => 'required|integer|min:1',
            'payment_mode' => 'required|in:cash,finance',
            'oem_id' => 'nullable|integer|exists:oem,id',
            'notes' => 'nullable|string',
            'variant_id' => 'nullable|integer|exists:variants,id',
            'brand_id' => 'nullable|integer|exists:brands,id',
            'selected_color_id' => 'nullable|integer|exists:colors,id',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $data = $validator->validated();

        $lead = Lead::create([
            'customer_name' => $data['customer_name'],
            'phone_no' => $data['phone_number'],
            'location' => $data['customer_location'],
            'tentative_purchase_date' => $data['purchase_date'],
            'vehicle_qty' => $data['quantity'],
            'payment_mode' => $data['payment_mode'],
            'brand_id' => $data['brand_id'] ?? null,
            'additional_note' => $data['notes'],
            'status' => 'Draft',
        ]);

        if ($data['variant_id']) {
            LeadVehicle::create([
                'lead_id' => $lead->id,
                'variant_id' => $data['variant_id'],
                'brand_id' => $data['brand_id'] ?? null,
                'vehicle_qty' => $data['quantity'],
                'color_id' => $data['selected_color_id'] ?? null,
            ]);
        }

        session(['lead_id' => $lead->id]);

        if ($request->has('add_another_vehicle')) {
            session([
                'draft_lead' => [
                    'customer_name' => $data['customer_name'],
                    'phone_number' => $data['phone_number'],
                    'customer_location' => $data['customer_location'],
                    'purchase_date' => $data['purchase_date'],
                    'quantity' => $data['quantity'],
                    'payment_mode' => $data['payment_mode'],
                    'oem_id' => $data['oem_id'],
                    'notes' => $data['notes'],
                ]
            ]);
            return redirect()->route('leads.model_details', ['variantId' => $data['variant_id']]);
        }

        if ($request->has('save_draft')) {
            session([
                'draft_lead' => [
                    'customer_name' => $data['customer_name'],
                    'phone_number' => $data['phone_number'],
                    'customer_location' => $data['customer_location'],
                    'purchase_date' => $data['purchase_date'],
                    'quantity' => $data['quantity'],
                    'payment_mode' => $data['payment_mode'],
                    'oem_id' => $data['oem_id'],
                    'notes' => $data['notes'],
                ]
            ]);
            return redirect()->back()->with('success', 'Lead saved as draft!');
        }

        return redirect()->route('leads.summary', ['leadId' => $lead->id]);
    }

    /**
     * Display the specified lead.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $lead = Lead::find($id);

        if (!$lead) {
            return response()->json([
                'success' => false,
                'message' => 'Lead not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $lead
        ], 200);
    }

    /**
     * Update the specified lead in storage.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $lead = Lead::find($id);

        if (!$lead) {
            return response()->json([
                'success' => false,
                'message' => 'Lead not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'customer_name' => 'sometimes|string|max:255',
            'phone_no' => 'sometimes|string|max:20',
            'location' => 'sometimes|string|max:255',
            'tentative_purchase_date' => 'nullable|date',
            'vehicle_qty' => 'sometimes|integer|min:1',
            'payment_mode' => 'sometimes|in:cash,finance',
            'brand_id' => 'nullable|integer|exists:brands,id',
            'additional_note' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $lead->update($validator->validated());

        return response()->json([
            'success' => true,
            'message' => 'Lead updated successfully',
            'data' => $lead
        ], 200);
    }

    /**
     * Remove the specified lead from storage.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $lead = Lead::find($id);

        if (!$lead) {
            return response()->json([
                'success' => false,
                'message' => 'Lead not found'
            ], 404);
        }

        $lead->delete();

        return response()->json([
            'success' => true,
            'message' => 'Lead deleted successfully'
        ], 200);
    }

    /**
     * Add a vehicle to an existing lead.
     *
     * @param Request $request
     * @param int $leadId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function addVehicle(Request $request, $leadId)
    {
        $validator = Validator::make($request->all(), [
            'variant_id' => 'required|integer|exists:variants,id',
            'brand_id' => 'nullable|integer|exists:brands,id',
            'vehicle_qty' => 'required|integer|min:1',
            'oem_id' => 'nullable|integer|exists:oems,id',
            'selected_color_id' => 'nullable|integer|exists:colors,id',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $lead = Lead::findOrFail($leadId);
        $data = $validator->validated();

        LeadVehicle::create([
            'lead_id' => $leadId,
            'variant_id' => $data['variant_id'],
            'brand_id' => $data['brand_id'],
            'vehicle_qty' => $data['vehicle_qty'],
            'oem_id' => $data['oem_id'],
            'color_id' => $data['selected_color_id'] ?? null,
        ]);

        $sumQty = LeadVehicle::where('lead_id', $leadId)->sum('vehicle_qty');
        $lead->update(['vehicle_qty' => $sumQty]);

        return redirect()->route('leads.summary', ['leadId' => $leadId]);
    }

    /**
     * Display the lead summary.
     *
     * @param int $leadId
     * @return \Illuminate\View\View
     */
    public function summary($leadId)
    {
        $lead = Lead::findOrFail($leadId);
        $vehicles = LeadVehicle::where('lead_id', $leadId)->get();
        $brands = Brand::all();
        $fuelTypes = FuelType::all();
        $ccs = Cc::all();
        $oems = Oem::all();
        $galleries = Gallery::whereIn('variant_id', $vehicles->pluck('variant_id'))->get();
        $variants = Variant::whereIn('id', $vehicles->pluck('variant_id'))->get();
        $colors = Color::all();

        return view('admin.leadgen.summary', compact('lead', 'vehicles', 'brands', 'fuelTypes', 'ccs', 'galleries', 'variants', 'colors', 'oems'));
    }

    /**
     * Submit all leads and finalize.
     *
     * @param int $leadId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function submitAll($leadId)
    {
        $lead = Lead::findOrFail($leadId);
        $lead->update(['status' => 'Submitted']);
        session()->forget(['lead_id', 'draft_lead']);
        return redirect()->route('leads.thank_you');
    }

    /**
     * Display the thank you page.
     *
     * @return \Illuminate\View\View
     */
    public function thankYou()
    {
        return view('admin.leadgen.thankyou');
    }
}