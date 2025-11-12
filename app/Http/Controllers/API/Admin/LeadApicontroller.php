<?php

namespace App\Http\Controllers\API\Admin;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\Admin\LeadRequest;
use App\Services\LeadService;
use App\Services\VehicleSegmentService;
use App\Services\FuelTypeService;
use App\Services\BrandService;
use App\Services\VariantService;
use App\Services\OemService;
use App\Models\Variant;
use App\Models\Lead;
use App\Models\LeadDetail;
use App\Models\Gallery;
use App\Models\TechSpec;
use App\Models\Feature;
use App\Models\LeadVehicle;
use App\Models\OEM;
use Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\FacadesLog;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class LeadApiController extends Controller
{
    /** @var LeadService */
    protected $leadService;

    /** @var VehicleSegmentService */
    protected $vehicleSegmentService;

    /** @var BrandService */
    protected $brandService;

    /** @var FuelTypeService */
    protected $fuelTypeService;

    /** @var VariantService */
    protected $variantService;

    /** @var OEMService */
    protected $oemService;

    /**
     * LeadApiController constructor.
     */
    public function __construct(
        LeadService $leadService,
        VehicleSegmentService $vehicleSegmentService,
        BrandService $brandService,
        FuelTypeService $fuelTypeService,
        VariantService $variantService,
        OEMService $oemService
    ) {
        // $this->middleware('auth:api');
        $this->leadService = $leadService;
        $this->vehicleSegmentService = $vehicleSegmentService;
        $this->brandService = $brandService;
        $this->fuelTypeService = $fuelTypeService;
        $this->variantService = $variantService;
        $this->oemService = $oemService;
    }





    // public function index(Request $request): JsonResponse
    // {
    //     try {
    //         $query = Lead::with('leadDetails'); // Include leadDetails

    //         // Optional: Filter by status if provided in query param
    //         if ($request->has('status')) {
    //             $query->where('status', $request->status);
    //         }

    //         $leads = $query->get();

    //         // ✅ Add counts for each status
    //         $counts = [
    //             'open' => Lead::where('status', 'Open')->count(),
    //             'closed' => Lead::where('status', 'Closed')->count(),
    //             'successful' => Lead::where('status', 'Successful')->count(),
    //             'draft' => LeadDetail::where('status', 'Draft')->count(),
    //             'total' => Lead::count(),
    //         ];

    //         return response()->json([
    //             'success' => true,
    //             'data' => $leads,
    //             'counts' => $counts,
    //         ], 200);

    //     } catch (\Throwable $e) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Failed to fetch leads: ' . $e->getMessage(),
    //         ], 500);
    //     }
    // }


    public function index(Request $request): JsonResponse
    {
        try {
            $query = Lead::with([
                'leadDetails.brand',
                'leadDetails.variant',
                'leadDetails.color'
            ]);

            // Optional: Filter by status if provided in query param
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            $leads = $query->get();

            // ✅ Add counts for each status
            $counts = [
                'open' => Lead::where('status', 'Open')->count(),
                'closed' => Lead::where('status', 'Closed')->count(),
                'successful' => Lead::where('status', 'Successful')->count(),
                'draft' => Lead::where('status', 'Draft')->count(),
                'total' => Lead::count(),
            ];

            return response()->json([
                'success' => true,
                'data' => $leads,
                'counts' => $counts,
            ], 200);

        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch leads: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function create($leadId = null): JsonResponse
    {
        $lead = null;
        if ($leadId) {
            $lead = Lead::findOrFail($leadId);
        }

        $vehicleSegments = $this->vehicleSegmentService->getAll();
        $brands = $this->brandService->getAll();
        $fuelTypes = $this->fuelTypeService->getAll();
        $variants = $this->variantService->getAll();
        $galleries = Gallery::with(['brand', 'variant', 'fuelType', 'color'])->get()->groupBy('brand_id');
        $currentStep = 'model_selection';

        return response()->json([
            'leadId' => $leadId,
            'lead' => $lead,
            'vehicleSegments' => $vehicleSegments,
            'brands' => $brands,
            'fuelTypes' => $fuelTypes,
            'variants' => $variants,
            'galleries' => $galleries,
            'currentStep' => $currentStep
        ]);
    }

    public function modelDetail(Gallery $gallery, $leadId = null): JsonResponse
    {
        $gallery->load(['brand', 'variant', 'fuelType', 'color']);

        $techSpecs = TechSpec::where('brand_id', $gallery->brand_id)
            ->where('variant_id', $gallery->variant_id)
            ->get();

        $features = Feature::where('brand_id', $gallery->brand_id)
            ->where('variant_id', $gallery->variant_id)
            ->get();

        $leadDetail = $leadId ? Lead::find($leadId) : null;

        return response()->json([
            'gallery' => $gallery,
            'techSpecs' => $techSpecs,
            'features' => $features,
            'leadDetail' => $leadDetail
        ]);
    }

    /**
     * Prepare data for lead creation form.
     */
    public function createLead(Request $request): JsonResponse
    {
        $data = $request->all();
        $lead = null;
        if (isset($data['lead_Id'])) {
            $lead = Lead::find($data['lead_Id']);
        }

        $oems = $this->oemService->getAll();

        return response()->json([
            'data' => $data,
            'oems' => $oems,
            'lead' => $lead
        ]);
    }





    public function store(Request $request)
    {
        Log::info('LEAD STORE REQUEST:', $request->all());

        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'phone_no' => 'required|string|regex:/^\d{10}$/',
            'vehicle_qty' => 'required|integer|min:1',
            'brand_id' => 'required|integer|exists:brands,id',
            'variant_id' => 'required|integer|exists:variants,id',
            'status' => 'required|in:Draft,Open',
            'lead_id' => 'nullable|integer|exists:leads,id',

            'city_id' => 'nullable|exists:cities,id',
            'area_id' => 'nullable|exists:areas,id',
            'area' => 'nullable|string|max:255',
            'executive_id' => 'nullable|integer|exists:users,id',
        ]);

        try {
            DB::beginTransaction();

            $leadId = $request->lead_id;
            $finalStatus = $validated['status'];

            $leadData = [
                'customer_name' => $validated['customer_name'],
                'phone_no' => $validated['phone_no'],
                'location' => $request->location,
                'area' => $request->area,
                'city_id' => $validated['city_id'],
                'area_id' => $validated['area_id'],
                'executive_id' => $request->executive_id ?? auth()->id(),
                'tentative_purchase_date' => $request->tentative_purchase_date,
                'vehicle_qty' => $validated['vehicle_qty'],
                'payment_mode' => $request->payment_mode,
                'additional_note' => $request->additional_note,
                'status' => $finalStatus,
            ];

            if ($leadId) {
                $lead = Lead::findOrFail($leadId);
                $lead->update($leadData);
            } else {
                $lead = Lead::create($leadData);
                $leadId = $lead->id;
            }

            Log::info('LEAD SAVED:', [
                'lead_id' => $leadId,
                'city_id' => $lead->city_id,
                'area_id' => $lead->area_id,
                'area' => $lead->area,
                'location' => $lead->location
            ]);

            // === VEHICLE LOGIC ===
            if ($finalStatus === 'Draft') {
                LeadDetail::where('lead_id', $leadId)->delete();
            }

            $exists = LeadDetail::where('lead_id', $leadId)
                ->where('variant_id', $validated['variant_id'])
                ->where('status', $finalStatus)
                ->exists();

            if (!$exists) {
                LeadDetail::create([
                    'lead_id' => $leadId,
                    'brand_id' => $validated['brand_id'],
                    'variant_id' => $validated['variant_id'],
                    'color_id' => $request->color_id,
                    'status' => $finalStatus,
                ]);
            }

            if ($finalStatus === 'Open') {
                LeadDetail::where('lead_id', $leadId)
                    ->where('status', 'Draft')
                    ->update(['status' => 'Open']);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'lead' => $lead->fresh()->load('details'),
                'lead_id' => $leadId,
                'message' => $finalStatus === 'Draft' ? 'Draft saved!' : 'Lead submitted!',
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('LEAD STORE FAILED:', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed: ' . $e->getMessage(),
            ], 500);
        }
    }
    // public function update(LeadRequest $request, int $id): JsonResponse
    // {
    //     $validated = $request->validated();
    //     $vehicles = $request->input('vehicles', []); // All vehicles from UI

    //     try {
    //         DB::beginTransaction();

    //         $lead = Lead::findOrFail($id);

    //         // 1. Update only the lead fields
    //         $lead->update([
    //             'customer_name' => $validated['customer_name'],
    //             'phone_no' => $validated['phone_no'],
    //             'location' => $request->location,
    //             'area' => $request->area,
    //             'tentative_purchase_date' => $request->tentative_purchase_date,
    //             'vehicle_qty' => count($vehicles),
    //             'payment_mode' => $validated['payment_mode'],
    //             'additional_note' => $request->additional_note,
    //             'status' => $validated['status'],
    //         ]);

    //         // 2. ONLY ADD NEW VEHICLES — NEVER DELETE OLD ONES
    //         foreach ($vehicles as $v) {
    //             // Skip if already exists in DB (by id)
    //             if (!empty($v['id']) && LeadDetail::where('id', $v['id'])->exists()) {
    //                 continue; // Already in DB → skip
    //             }

    //             // Insert only new vehicles
    //             LeadDetail::create([
    //                 'lead_id' => $lead->id,
    //                 'brand_id' => $v['brand_id'],
    //                 'variant_id' => $v['variant_id'],
    //                 'color_id' => $v['color_id'] ?? null,
    //                 'status' => 'Draft',
    //             ]);
    //         }

    //         DB::commit();

    //         return response()->json([
    //             'success' => true,
    //             'message' => 'New vehicle added successfully!',
    //             'lead_id' => $lead->id,
    //         ]);

    //     } catch (\Exception $e) {
    //         DB::rollBack();
    //         Log::error('Lead update failed: ' . $e->getMessage());

    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Failed to add vehicle: ' . $e->getMessage(),
    //         ], 500);
    //     }
    // }

    // public function update(Request $request, $id): JsonResponse
    // {
    //     $validated = $request->validate([
    //         'customer_name' => 'required|string|max:255',
    //         'phone_no' => 'nullable|string|regex:/^\d{10}$/',
    //         'location' => 'nullable|string',
    //         'area' => 'nullable|string',
    //         'tentative_purchase_date' => 'nullable|date',
    //         'payment_mode' => 'required|in:cash,finance',
    //         'additional_note' => 'nullable|string',
    //         'vehicles' => 'required|array',
    //         'vehicles.*.id' => 'nullable|integer|exists:lead_details,id',
    //         'vehicles.*.brand_id' => 'required|integer|exists:brands,id',
    //         'vehicles.*.variant_id' => 'required|integer|exists:variants,id',
    //         'vehicles.*.color_id' => 'nullable|integer|exists:colors,id',
    //     ]);

    //     try {
    //         DB::beginTransaction();

    //         $lead = Lead::findOrFail($id);

    //         // Update main lead
    //         $lead->update([
    //             'customer_name' => $validated['customer_name'],
    //             'phone_no' => $validated['phone_no'],
    //             'location' => $validated['location'],
    //             'area' => $validated['area'],
    //             'tentative_purchase_date' => $validated['tentative_purchase_date'],
    //             'payment_mode' => $validated['payment_mode'],
    //             'additional_note' => $validated['additional_note'],
    //             'vehicle_qty' => count($validated['vehicles']),
    //         ]);

    //         $existingDetailIds = LeadDetail::where('lead_id', $id)
    //             ->where('status', 'Draft')
    //             ->pluck('id')
    //             ->toArray();

    //         $incomingIds = collect($validated['vehicles'])
    //             ->pluck('id')
    //             ->filter()
    //             ->toArray();

    //         // Delete vehicles that were removed (not in incoming list)
    //         $toDelete = array_diff($existingDetailIds, $incomingIds);
    //         if (!empty($toDelete)) {
    //             LeadDetail::whereIn('id', $toDelete)->delete();
    //         }

    //         // Update or Create vehicles
    //         foreach ($validated['vehicles'] as $vehicle) {
    //             $data = [
    //                 'brand_id' => $vehicle['brand_id'],
    //                 'variant_id' => $vehicle['variant_id'],
    //                 'color_id' => $vehicle['color_id'] ?? null,
    //             ];

    //             if (!empty($vehicle['id'])) {
    //                 // Update existing
    //                 LeadDetail::where('id', $vehicle['id'])
    //                     ->where('lead_id', $id)
    //                     ->update($data);
    //             } else {
    //                 // Create new
    //                 LeadDetail::create(array_merge($data, [
    //                     'lead_id' => $id,
    //                     'status' => 'Draft',
    //                 ]));
    //             }
    //         }

    //         DB::commit();

    //         return response()->json([
    //             'success' => true,
    //             'message' => 'Draft updated successfully!',
    //             'lead_id' => $id,
    //         ]);
    //     } catch (\Exception $e) {
    //         DB::rollBack();
    //         Log::error('Lead update failed: ' . $e->getMessage());
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Update failed: ' . $e->getMessage(),
    //         ], 500);
    //     }
    // }

    public function update(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'phone_no' => 'required|string|regex:/^\d{10}$/',
            'location' => 'nullable|string',
            // 'area' => 'nullable|string',
            'tentative_purchase_date' => 'nullable|date',
            'payment_mode' => 'required|in:cash,finance',
            'additional_note' => 'nullable|string',
            'status' => 'required|in:Draft,Open', // <-- Yeh add karna zaroori hai
            'vehicles' => 'nullable|array|min:1',
            'vehicles.*.id' => 'nullable|integer',
            'vehicles.*.brand_id' => 'required|integer|exists:brands,id',
            'vehicles.*.variant_id' => 'required|integer|exists:variants,id',
            'vehicles.*.color_id' => 'nullable|integer|exists:colors,id',
        ]);

        DB::beginTransaction();
        try {
            $lead = Lead::findOrFail($id);

            // Update main lead
            $lead->update([
                'customer_name' => $validated['customer_name'],
                'phone_no' => $validated['phone_no'],
                'location' => $validated['location'],
                'area' => $validated['area'],
                'tentative_purchase_date' => $validated['tentative_purchase_date'],
                'payment_mode' => $validated['payment_mode'],
                'additional_note' => $validated['additional_note'],
                'status' => $validated['status'], // <-- Status update
                'vehicle_qty' => count($validated['vehicles']),
            ]);

            // Get current vehicle IDs
            $existingIds = LeadDetail::where('lead_id', $id)->pluck('id')->toArray();
            $incomingIds = collect($validated['vehicles'])
                ->pluck('id')
                ->filter()
                ->map(fn($id) => (int) $id)
                ->toArray();

            // Delete removed vehicles
            $toDelete = array_diff($existingIds, $incomingIds);
            if ($toDelete) {
                LeadDetail::whereIn('id', $toDelete)->delete();
            }

            // Update or Create vehicles
            foreach ($validated['vehicles'] as $vehicle) {
                $data = [
                    'brand_id' => $vehicle['brand_id'],
                    'variant_id' => $vehicle['variant_id'],
                    'color_id' => $vehicle['color_id'] ?? null,
                    'status' => $validated['status'], // <-- Har vehicle ka status sync
                ];

                if (!empty($vehicle['id'])) {
                    LeadDetail::where('id', $vehicle['id'])
                        ->where('lead_id', $id)
                        ->update($data);
                } else {
                    LeadDetail::create(array_merge($data, [
                        'lead_id' => $id,
                    ]));
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => $validated['status'] === 'Draft'
                    ? 'Draft updated successfully!'
                    : 'Lead updated and submitted!',
                'lead' => $lead->fresh(['leadDetails.brand', 'leadDetails.variant', 'leadDetails.color'])
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Lead update failed: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'success' => false,
                'message' => 'Update failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    // public function destroy($id)
    // {
    //     $leadDetail = LeadDetail::find($id);

    //     if (!$leadDetail) {
    //         return response()->json(['success' => false, 'message' => 'Vehicle not found'], 404);
    //     }

    //     $leadDetail->delete();

    //     return response()->json(['success' => true, 'message' => 'Vehicle deleted successfully']);
    // }

    public function destroy($id)
    {
        $detail = LeadDetail::find($id);
        if (!$detail) {
            return response()->json(['success' => false, 'message' => 'Vehicle not found'], 404);
        }
        $detail->delete();
        return response()->json(['success' => true, 'message' => 'Vehicle deleted']);
    }

    public function destroyCompleteLead($leadId)
    {
        try {
            DB::beginTransaction();
            LeadDetail::where('lead_id', $leadId)->delete();
            Lead::where('id', $leadId)->delete();
            DB::commit();
            return response()->json(['success' => true, 'message' => 'Lead deleted completely']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }


    public function getByBrandSelectVariant($brand_id): JsonResponse
    {
        $variants = Variant::where('brand_id', $brand_id)
            ->pluck('name', 'id')
            ->all();

        return response()->json($variants);
    }

    public function submitAll(Request $request)
    {
        $leadIds = $request->lead_ids ?? [];
        if (!$leadIds)
            return response()->json(['message' => 'No leads provided'], 400);

        Lead::whereIn('id', $leadIds)->update(['status' => 'Open']);
        return response()->json(['message' => 'All leads submitted successfully']);
    }

    public function getDrafts()
    {
        try {
            $draftLeads = LeadDetail::where('status', 'Open')
                ->with(['lead', 'brand', 'variant', 'color'])
                ->latest()
                ->get();

            $formattedLeads = $draftLeads->map(function ($detail) {
                $lead = $detail->lead;

                return [
                    'id' => $detail->id,
                    'lead_id' => $detail->lead_id,
                    'customer_name' => $lead ? $lead->customer_name : 'N/A',
                    'phone_no' => $lead ? $lead->phone_no : 'N/A',
                    'location' => $lead ? $lead->location : null,
                    'tentative_purchase_date' => $lead ? $lead->tentative_purchase_date : null,
                    'vehicle_qty' => $lead ? $lead->vehicle_qty : 1,
                    'payment_mode' => $lead ? $lead->payment_mode : 'cash',
                    'additional_note' => $lead ? $lead->additional_note : null,
                    'oem_id' => $lead ? $lead->oem_id : null,
                    'status' => $detail->status,
                    'invoice_no' => $detail->invoice_no,
                    'uploaded_invoice' => $detail->uploaded_invoice,
                    'created_at' => $detail->created_at,
                    'updated_at' => $detail->updated_at,
                    'leadDetails' => [
                        [
                            'id' => $detail->id,
                            'lead_id' => $detail->lead_id,
                            'brand_id' => $detail->brand_id,
                            'variant_id' => $detail->variant_id,
                            'color_id' => $detail->color_id,
                            'status' => $detail->status,
                            'invoice_no' => $detail->invoice_no,
                            'uploaded_invoice' => $detail->uploaded_invoice,
                            'brand_name' => $detail->brand ? $detail->brand->name : null,
                            'variant_name' => $detail->variant ? $detail->variant->name : null,
                            'color_name' => $detail->color ? $detail->color->name : null,
                        ]
                    ]
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $formattedLeads,
                'message' => $formattedLeads->isEmpty() ? 'No open leads found.' : 'Open leads retrieved successfully.'
            ], 200);
        } catch (\Exception $e) {
            Log::error('Failed to fetch open leads: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch open leads.',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    public function show($id)
    {
        $lead = Lead::with([
            'details.brand',
            'details.variant',
            'details.color',
            'details.variant.brand'
        ])->findOrFail($id);

        return response()->json([
            'status' => true,
            'data' => $lead
        ]);
    }

    public function getLeadData()
    {
        try {
            return response()->json([
                'lead' => Lead::find(request()->query('lead_id')) ?? [],
                'oems' => OEM::all(),
                'existingVehicles' => LeadDetail::where('lead_id', request()->query('lead_id'))->get() ?? [],
                'data' => [
                    'vehicle_segment_id' => '',
                    'brand_id' => '',
                    'variant_id' => '',
                    'fuel_type_id' => '',
                    'color' => '',
                    'color_id' => ''
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['errors' => [$e->getMessage()]], 500);
        }
    }

    public function latest()
    {
        $lead = Lead::orderBy('created_at', 'desc')->first();
        return response()->json($lead);
    }


    public function draft()
    {
        try {
            \Log::info('=== DRAFT API CALLED - FIXED COLORS COLUMN ===');

            // Use only columns that actually exist in your tables
            $draftDetails = DB::table('lead_details as ld')
                ->leftJoin('leads as l', 'ld.lead_id', '=', 'l.id')
                ->leftJoin('brands as b', 'ld.brand_id', '=', 'b.id')
                ->leftJoin('variants as v', 'ld.variant_id', '=', 'v.id')
                ->leftJoin('colors as c', 'ld.color_id', '=', 'c.id')
                ->where('ld.status', 'Draft')
                ->select(
                    'ld.id',
                    'ld.lead_id',
                    'ld.brand_id',
                    'ld.variant_id',
                    'ld.color_id',
                    'ld.status',
                    'ld.created_at',
                    'ld.updated_at',
                    'l.customer_name',
                    'l.phone_no',
                    'l.location',
                    'l.payment_mode',
                    'l.tentative_purchase_date',
                    'l.additional_note',
                    'b.name as brand_name',
                    'v.name as variant_name',
                    'c.name as color_name', // Use only existing columns
                    'c.color_code'
                )
                ->get();

            \Log::info('Raw draft details count: ' . $draftDetails->count());

            if ($draftDetails->isEmpty()) {
                return response()->json([
                    'success' => true,
                    'data' => [],
                    'message' => 'No draft leads found'
                ]);
            }

            // Group by lead_id
            $groupedLeads = [];

            foreach ($draftDetails as $item) {
                $leadId = $item->lead_id;

                if (!isset($groupedLeads[$leadId])) {
                    $groupedLeads[$leadId] = [
                        'lead_id' => $leadId,
                        'customer_name' => $item->customer_name ?? 'N/A',
                        'phone_no' => $item->phone_no ?? 'N/A',
                        'location' => $item->location ?? null,
                        'payment_mode' => $item->payment_mode ?? 'cash',
                        'tentative_purchase_date' => $item->tentative_purchase_date ?? null,
                        'vehicle_qty' => 0,
                        'additional_note' => $item->additional_note ?? null,
                        'status' => 'Draft',
                        'created_at' => $item->created_at,
                        'updated_at' => $item->updated_at,
                        'leadDetails' => []
                    ];
                }

                // Add vehicle detail
                $groupedLeads[$leadId]['leadDetails'][] = [
                    'id' => $item->id,
                    'lead_id' => $item->lead_id,
                    'brand_id' => $item->brand_id,
                    'variant_id' => $item->variant_id,
                    'color_id' => $item->color_id,
                    'brand_name' => $item->brand_name ?? 'Unknown Brand',
                    'variant_name' => $item->variant_name ?? 'Unknown Variant',
                    'color_name' => $item->color_name ?? '', // Use color_name directly
                    'color_code' => $item->color_code ?? '',
                    'status' => $item->status
                ];

                $groupedLeads[$leadId]['vehicle_qty']++;
            }

            // Convert to array and reset keys
            $leads = array_values($groupedLeads);

            \Log::info('Grouped leads count: ' . count($leads));

            return response()->json([
                'success' => true,
                'data' => $leads,
                'count' => count($leads),
                'total_vehicles' => $draftDetails->count(),
                'message' => 'Draft leads retrieved successfully'
            ]);

        } catch (\Exception $e) {
            \Log::error('Draft API error: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch draft leads: ' . $e->getMessage(),
                'data' => []
            ], 500);
        }
    }


    // public function draft()
    // {
    //     try {
    //         Log::info('=== DRAFT API CALLED - FIXED COLORS COLUMN ===');

    //         // Use only columns that actually exist in your tables
    //         $draftDetails = DB::table('lead_details as ld')
    //             ->leftJoin('leads as l', 'ld.lead_id', '=', 'l.id')
    //             ->leftJoin('brands as b', 'ld.brand_id', '=', 'b.id')
    //             ->leftJoin('variants as v', 'ld.variant_id', '=', 'v.id')
    //             ->leftJoin('colors as c', 'ld.color_id', '=', 'c.id')
    //             ->where('ld.status', 'Draft')
    //             ->select(
    //                 'ld.id',
    //                 'ld.lead_id',
    //                 'ld.brand_id',
    //                 'ld.variant_id',
    //                 'ld.color_id',
    //                 'ld.status',
    //                 'ld.created_at',
    //                 'ld.updated_at',
    //                 'l.customer_name',
    //                 'l.phone_no',
    //                 'l.location',
    //                 'l.payment_mode',
    //                 'l.tentative_purchase_date',
    //                 'l.additional_note',
    //                 'b.name as brand_name',
    //                 'v.name as variant_name',
    //                 'c.name as color_name',
    //                 'c.color_code'
    //             )
    //             ->get();

    //         Log::info('Raw draft details count: ' . $draftDetails->count());

    //         if ($draftDetails->isEmpty()) {
    //             return response()->json([
    //                 'success' => true,
    //                 'data' => [],
    //                 'message' => 'No draft leads found'
    //             ]);
    //         }

    //         // Group by lead_id
    //         $groupedLeads = [];

    //         foreach ($draftDetails as $item) {
    //             $leadId = $item->lead_id;

    //             if (!isset($groupedLeads[$leadId])) {
    //                 $groupedLeads[$leadId] = [
    //                     'lead_id' => $leadId,
    //                     'customer_name' => $item->customer_name ?? 'N/A',
    //                     'phone_no' => $item->phone_no ?? 'N/A',
    //                     'location' => $item->location ?? null,
    //                     'payment_mode' => $item->payment_mode ?? 'cash',
    //                     'tentative_purchase_date' => $item->tentative_purchase_date ?? null,
    //                     'vehicle_qty' => 0,
    //                     'additional_note' => $item->additional_note ?? null,
    //                     'status' => 'Draft',
    //                     'created_at' => $item->created_at,
    //                     'updated_at' => $item->updated_at,
    //                     'leadDetails' => []
    //                 ];
    //             }

    //             // Add vehicle detail
    //             $groupedLeads[$leadId]['leadDetails'][] = [
    //                 'id' => $item->id,
    //                 'lead_id' => $item->lead_id,
    //                 'brand_id' => $item->brand_id,
    //                 'variant_id' => $item->variant_id,
    //                 'color_id' => $item->color_id,
    //                 'brand_name' => $item->brand_name ?? 'Unknown Brand',
    //                 'variant_name' => $item->variant_name ?? 'Unknown Variant',
    //                 'color_name' => $item->color_name ?? '', // Use color_name directly
    //                 'color_code' => $item->color_code ?? '',
    //                 'status' => $item->status
    //             ];

    //             $groupedLeads[$leadId]['vehicle_qty']++;
    //         }

    //         // Convert to array and reset keys
    //         $leads = array_values($groupedLeads);

    //         Log::info('Grouped leads count: ' . count($leads));

    //         return response()->json([
    //             'success' => true,
    //             'data' => $leads,
    //             'count' => count($leads),
    //             'total_vehicles' => $draftDetails->count(),
    //             'message' => 'Draft leads retrieved successfully'
    //         ]);

    //     } catch (\Exception $e) {
    //         Log::error('Draft API error: ' . $e->getMessage());
    //         Log::error('Stack trace: ' . $e->getTraceAsString());

    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Failed to fetch draft leads: ' . $e->getMessage(),
    //             'data' => []
    //         ], 500);
    //     }
    // }


    public function vehicleFilterData(Request $request): JsonResponse
    {
        try {
            $query = Gallery::query()
                ->with(['brand', 'variant'])
                ->select(
                    'galleries.id',
                    'galleries.cover_photos',
                    'galleries.brand_id',
                    'galleries.variant_id',
                    'galleries.oem_id',
                    'galleries.fuel_type_id',
                    'galleries.color_id'
                )
                ->leftJoin('lead_details', function ($join) {
                    $join->on('galleries.variant_id', '=', 'lead_details.variant_id')
                        ->where('lead_details.status', 'Open');
                })
                ->groupBy(
                    'galleries.id',
                    'galleries.cover_photos',
                    'galleries.brand_id',
                    'galleries.variant_id',
                    'galleries.oem_id',
                    'galleries.fuel_type_id',
                    'galleries.color_id'
                )
                ->selectRaw('COUNT(lead_details.id) as open_leads_count')
                ->take(4);

            if ($request->filled('brand_id')) {
                $query->where('galleries.brand_id', $request->brand_id);
            }

            if ($request->filled('variant_id')) {
                $query->where('galleries.variant_id', $request->variant_id);
            }

            if ($request->filled('fuel_type_id')) {
                $query->where('galleries.fuel_type_id', $request->fuel_type_id);
            }

            $galleries = $query->get();

            return response()->json([
                'success' => true,
                'galleries' => $galleries->map(function ($gallery) {
                    $photos = [];

                    // Safely handle cover_photos
                    if (is_string($gallery->cover_photos)) {
                        $decoded = json_decode($gallery->cover_photos, true);
                        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                            $photos = $decoded;
                        }
                    } elseif (is_array($gallery->cover_photos)) {
                        $photos = $gallery->cover_photos;
                    }

                    $coverPhotoUrls = [];
                    foreach ($photos as $photo) {
                        $cleanPath = ltrim($photo, '/');
                        $fullPath = 'galleries/' . basename($cleanPath); // Enforce folder

                        if (Storage::disk('public')->exists($fullPath)) {
                            $coverPhotoUrls[] = Storage::disk('public')->url($fullPath);
                        } else {
                            Log::warning('Image not found at path: ' . $fullPath);
                            $coverPhotoUrls[] = asset('images/fallback.jpg');
                        }
                    }

                    return [
                        'id' => $gallery->id,
                        'cover_photos' => $coverPhotoUrls,
                        'brand_name' => $gallery->brand->name ?? 'Unknown Brand',
                        'variant_name' => $gallery->variant->name ?? 'Unknown Variant',
                        'open_leads_count' => $gallery->open_leads_count ?? 0,
                    ];
                })->filter(function ($gallery) {
                    return !empty($gallery['cover_photos']);
                })->values(),
                'message' => $galleries->isEmpty() ? 'No galleries found.' : 'Galleries retrieved successfully.'
            ], 200);
        } catch (\Throwable $e) {
            Log::error('Failed to fetch galleries: ' . $e->getMessage() . ' in ' . $e->getFile() . ' at line ' . $e->getLine());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch galleries.',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Submit a draft lead
     */

    public function submitDraft(Request $request, $leadId)
    {
        Log::info('Submit draft request:', [
            'lead_id' => $leadId,
            'request_data' => $request->all()
        ]);

        try {
            DB::beginTransaction();

            $lead = Lead::find($leadId);
            if (!$lead) {
                return response()->json([
                    'success' => false,
                    'message' => 'Lead not found'
                ], 404);
            }

            $lead->update([
                'status' => 'Open'
            ]);

            // Also update the lead detail status
            LeadDetail::where('lead_id', $leadId)
                ->update(['status' => 'Open']);

            DB::commit();

            Log::info('Draft submitted successfully:', [
                'lead_id' => $leadId,
                'new_status' => 'Open'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Lead submitted successfully!',
                'data' => $lead
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Submit draft failed: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to submit lead: ' . $e->getMessage()
            ], 500);
        }
    }

    public function submitDraftLead($leadId): JsonResponse
    {
        Log::info('Submit draft lead:', ['lead_id' => $leadId]);
        try {
            DB::beginTransaction();

            $lead = Lead::findOrFail($leadId);
            $lead->update(['status' => 'Open']);

            // ✅ CRITICAL: Convert ALL vehicles to Open
            LeadDetail::where('lead_id', $leadId)
                ->where('status', 'Draft')
                ->update(['status' => 'Open']);

            DB::commit();

            Log::info('Draft submitted:', ['lead_id' => $leadId]);
            return response()->json([
                'success' => true,
                'lead_id' => $leadId,
                'message' => 'Lead submitted successfully!'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Submit draft failed:', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to submit: ' . $e->getMessage()
            ], 500);
        }
    }


    public function debugLeadVehicles($lead)
    {
        try {
            $leadRecord = Lead::with('leadDetails')->find($lead);

            if (!$leadRecord) {
                return response()->json([
                    'success' => false,
                    'message' => "Lead with ID {$lead} not found"
                ], 404);
            }

            $vehicles = $leadRecord->leadDetails->map(function ($detail) {
                return [
                    'id' => $detail->id,
                    'lead_id' => $detail->lead_id,
                    'brand_id' => $detail->brand_id,
                    'variant_id' => $detail->variant_id,
                    'color_id' => $detail->color_id,
                    'status' => $detail->status,
                    'created_at' => $detail->created_at,
                    'updated_at' => $detail->updated_at
                ];
            });

            return response()->json([
                'success' => true,
                'lead_id' => $lead,
                'lead_status' => $leadRecord->status,
                'customer_name' => $leadRecord->customer_name,
                'lead_vehicle_qty' => $leadRecord->vehicle_qty, // From leads table
                'actual_vehicles_count' => $vehicles->count(), // From lead_details table
                'vehicles' => $vehicles,
                'draft_vehicles' => $vehicles->where('status', 'Draft')->values(),
                'open_vehicles' => $vehicles->where('status', 'Open')->values(),
                'other_status_vehicles' => $vehicles->whereNotIn('status', ['Draft', 'Open'])->values()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
    public function updateStatus(Request $request, $leadId)
    {
        Log::info('Update status request:', [
            'lead_id' => $leadId,
            'request_data' => $request->all()
        ]);

        try {
            $validated = $request->validate([
                'status' => 'required|string|in:Open,closed',
                'lead_detail_id' => 'required|integer'
            ]);

            DB::beginTransaction();

            $lead = Lead::find($leadId);
            if (!$lead) {
                return response()->json([
                    'success' => false,
                    'message' => 'Lead not found'
                ], 404);
            }

            $lead->update([
                'status' => $validated['status'] // ✅ USE REQUEST STATUS
            ]);

            $leadDetail = LeadDetail::find($validated['lead_detail_id']);
            if (!$leadDetail) {
                return response()->json([
                    'success' => false,
                    'message' => 'Lead detail not found'
                ], 404);
            }

            $leadDetail->update([
                'status' => $validated['status'] // ✅ USE REQUEST STATUS
            ]);

            DB::commit();

            Log::info('Status updated successfully:', [
                'lead_id' => $leadId,
                'status' => $validated['status']
            ]);

            return response()->json([
                'success' => true,
                'message' => "Lead status updated to {$validated['status']} successfully!",
                'data' => ['lead' => $lead, 'lead_detail' => $leadDetail]
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Update lead status failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update lead status: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete complete lead with all its details
     */
    // public function destroyCompleteLead($leadId)
    // {
    //     Log::info('Deleting complete lead:', ['lead_id' => $leadId]);

    //     try {
    //         DB::beginTransaction();

    //         // Find the lead
    //         $lead = Lead::find($leadId);

    //         if (!$lead) {
    //             Log::warning('Lead not found for deletion:', ['lead_id' => $leadId]);
    //             return response()->json([
    //                 'success' => false,
    //                 'message' => 'Lead not found'
    //             ], 404);
    //         }

    //         // Delete all lead details first
    //         LeadDetail::where('lead_id', $leadId)->delete();

    //         // Then delete the main lead
    //         $lead->delete();

    //         DB::commit();

    //         Log::info('Complete lead deleted successfully:', ['lead_id' => $leadId]);

    //         return response()->json([
    //             'success' => true,
    //             'message' => 'Lead and all associated details deleted successfully'
    //         ], 200);

    //     } catch (\Exception $e) {
    //         DB::rollBack();
    //         Log::error('Complete lead deletion failed:', [
    //             'lead_id' => $leadId,
    //             'error' => $e->getMessage(),
    //             'trace' => $e->getTraceAsString()
    //         ]);

    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Failed to delete lead: ' . $e->getMessage(),
    //         ], 500);
    //     }
    // }


    public function addVehicle(Request $request, $leadId): JsonResponse
    {
        Log::info('Add vehicle:', ['lead_id' => $leadId]);
        try {
            $validated = $request->validate([
                'brand_id' => 'required|integer|exists:brands,id',
                'variant_id' => 'required|integer|exists:variants,id',
                'color_id' => 'nullable|integer', // Remove exists check
                'status' => 'required|string|in:Draft,Open'
            ]);

            $lead = Lead::findOrFail($leadId);

            DB::beginTransaction();

            // ✅ ONLY CREATE if doesn't exist for this status
            $existing = LeadDetail::where('lead_id', $leadId)
                ->where('variant_id', $validated['variant_id'])
                ->where('status', $validated['status'])
                ->first();

            if (!$existing) {
                LeadDetail::create([
                    'lead_id' => $leadId,
                    'brand_id' => $validated['brand_id'],
                    'variant_id' => $validated['variant_id'],
                    'color_id' => $validated['color_id'],
                    'status' => $validated['status'],
                ]);
            }

            // Update vehicle_qty to actual count
            $vehicleCount = LeadDetail::where('lead_id', $leadId)->count();
            $lead->update(['vehicle_qty' => $vehicleCount]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Vehicle added successfully',
                'lead_id' => $leadId,
                'vehicle_qty' => $vehicleCount
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }


    public function updateVehicle(Request $request, $leadDetailId): JsonResponse
    {
        Log::info('Update vehicle request:', [
            'lead_detail_id' => $leadDetailId,
            'request_data' => $request->all()
        ]);

        try {
            // Validate the request
            $validated = $request->validate([
                'brand_id' => 'required|integer|exists:brands,id',
                'variant_id' => 'required|integer|exists:variants,id',
                'color_id' => 'nullable|integer|exists:colors,id',
                'status' => 'required|string|in:Draft,Open,converted,Unrealized',
            ]);

            // Find the lead detail
            $leadDetail = LeadDetail::find($leadDetailId);
            if (!$leadDetail) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vehicle not found'
                ], 404);
            }

            DB::beginTransaction();

            // Update the vehicle
            $leadDetail->update([
                'brand_id' => $validated['brand_id'],
                'variant_id' => $validated['variant_id'],
                'color_id' => $validated['color_id'] ?? null,
                'status' => $validated['status'],
            ]);

            DB::commit();

            // Load relationships for response
            $leadDetail->load(['brand', 'variant', 'color']);

            Log::info('Vehicle updated successfully:', [
                'lead_detail_id' => $leadDetailId
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Vehicle updated successfully',
                'data' => [
                    'id' => $leadDetail->id,
                    'lead_id' => $leadDetail->lead_id,
                    'brand_id' => $leadDetail->brand_id,
                    'variant_id' => $leadDetail->variant_id,
                    'color_id' => $leadDetail->color_id,
                    'status' => $leadDetail->status,
                    'invoice_no' => $leadDetail->invoice_no,
                    'uploaded_invoice' => $leadDetail->uploaded_invoice,
                    'brand_name' => $leadDetail->brand->name ?? null,
                    'variant_name' => $leadDetail->variant->name ?? null,
                    'color_name' => $leadDetail->color->name ?? null,
                    'color_code' => $leadDetail->color->color_code ?? null,
                ]
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to update vehicle:', [
                'lead_detail_id' => $leadDetailId,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update vehicle: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get leads by status with details
     */
    public function getLeadsByStatus(Request $request)
    {
        try {
            $status = $request->query('status');

            if (!$status) {
                return response()->json([
                    'success' => false,
                    'message' => 'Status parameter is required'
                ], 400);
            }

            // Validate status parameter
            $validStatuses = ['Open', 'Converted', 'Unrealized', 'Draft', 'Submitted', 'Closed'];
            if (!in_array($status, $validStatuses)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid status. Valid statuses are: ' . implode(', ', $validStatuses)
                ], 400);
            }

            // Get leads with relationships - using 'lead_details' instead of 'details'
            $leads = Lead::where('status', $status)
                ->with(['lead_details.brand', 'lead_details.variant', 'lead_details.color'])
                ->orderBy('created_at', 'desc')
                ->get();

            // Format the response to match frontend expectations
            $formattedLeads = $leads->map(function ($lead) {
                return [
                    'id' => $lead->id,
                    'customer_name' => $lead->customer_name,
                    'phone_no' => $lead->phone_no,
                    'location' => $lead->location,
                    'address' => $lead->address,
                    'tentative_purchase_date' => $lead->tentative_purchase_date,
                    'vehicle_qty' => $lead->vehicle_qty,
                    'payment_mode' => $lead->payment_mode,
                    'status' => $lead->status,
                    'additional_note' => $lead->additional_note,
                    'executive_id' => $lead->executive_id,
                    'created_at' => $lead->created_at,
                    'updated_at' => $lead->updated_at,
                    'lead_details' => $lead->lead_details->map(function ($detail) {
                        return [
                            'id' => $detail->id,
                            'lead_id' => $detail->lead_id,
                            'brand_id' => $detail->brand_id,
                            'variant_id' => $detail->variant_id,
                            'color_id' => $detail->color_id,
                            'qty' => $detail->qty,
                            'status' => $detail->status,
                            'invoice_no' => $detail->invoice_no,
                            'uploaded_invoice' => $detail->uploaded_invoice,
                            'close_reason' => $detail->close_reason,
                            'created_at' => $detail->created_at,
                            'updated_at' => $detail->updated_at,
                            // Brand information
                            'brand_name' => $detail->brand ? $detail->brand->name : null,
                            'brand' => $detail->brand ? [
                                'id' => $detail->brand->id,
                                'name' => $detail->brand->name
                            ] : null,
                            // Variant information
                            'variant_name' => $detail->variant ? $detail->variant->name : null,
                            'variant' => $detail->variant ? [
                                'id' => $detail->variant->id,
                                'name' => $detail->variant->name,
                                'basic_price' => $detail->variant->basic_price,
                                'description' => $detail->variant->description
                            ] : null,
                            // Color information
                            'color_name' => $detail->color ? ($detail->color->color_name ?? $detail->color->name) : null,
                            'color_code' => $detail->color ? $detail->color->color_code : null,
                            'color' => $detail->color ? [
                                'id' => $detail->color->id,
                                'name' => $detail->color->name,
                                'color_name' => $detail->color->color_name,
                                'color_code' => $detail->color->color_code
                            ] : null
                        ];
                    })
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $formattedLeads,
                'count' => $leads->count(),
                'message' => $leads->isEmpty()
                    ? "No $status leads found."
                    : "$status leads retrieved successfully."
            ], 200);

        } catch (\Throwable $e) {
            Log::error('Failed to fetch leads by status: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch leads.',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    public function closeVehicle(Request $request, $leadDetailId): JsonResponse
    {
        Log::info('closeVehicle called', ['leadDetailId' => $leadDetailId, 'data' => $request->all()]);

        try {
            DB::beginTransaction();

            $leadDetail = LeadDetail::with('lead')->find($leadDetailId);
            if (!$leadDetail) {
                return response()->json(['success' => false, 'message' => 'Vehicle not found'], 404);
            }

            $leadId = $leadDetail->lead_id;

            // Validate based on close_type
            $request->validate([
                'close_type' => 'nullable|in:converted,Unrealized',
                'invoice_no' => 'required_if:close_type,converted|string|nullable',
                'uploaded_invoice' => 'nullable',
                'close_reason' => 'nullable:close_type,Unrealized|string|nullable',
            ]);

            $closeType = $request->close_type;
            $updateData = ['status' => $closeType];

            if ($closeType === 'converted') {
                $updateData['invoice_no'] = $request->invoice_no;
                if ($request->hasFile('uploaded_invoice')) {
                    $path = $request->file('uploaded_invoice')->store('invoices', 'public');
                    $updateData['uploaded_invoice'] = $path;
                }
            } else {
                $updateData['close_reason'] = $request->close_reason;
            }

            $leadDetail->update($updateData);

            // ONLY close entire lead if ALL vehicles are now closed
            $openCount = LeadDetail::where('lead_id', $leadId)
                ->where('status', 'Open')
                ->count();

            if ($openCount === 0) {
                Lead::where('id', $leadId)->update(['status' => 'Closed']);
                Log::info("Entire lead closed due to no open vehicles", ['lead_id' => $leadId]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Vehicle marked as ' . $closeType . ' successfully',
                'data' => $leadDetail->fresh(['brand', 'variant', 'color'])
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('closeVehicle failed', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to close vehicle: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Close entire lead (all vehicles) with invoice support
     */
    public function closeEntireLead(Request $request, $leadId): JsonResponse
    {
        Log::info('Close entire lead request:', [
            'lead_id' => $leadId,
            'request_data' => $request->all()
        ]);

        try {
            $validated = $request->validate([
                'close_type' => 'required|string|in:converted,Unrealized',
                'unrealized_reason' => 'required_if:close_type,Unrealized|string|nullable',
                'invoice_no' => 'required_if:close_type,converted|string|nullable',
                'uploaded_invoice' => 'nullable',
            ]);

            DB::beginTransaction();

            // Find the lead
            $lead = Lead::find($leadId);
            if (!$lead) {
                return response()->json([
                    'success' => false,
                    'message' => 'Lead not found'
                ], 404);
            }

            // Get all vehicles in this lead
            $vehicles = LeadDetail::where('lead_id', $leadId)->get();

            // Handle file upload for invoice copy
            $uploadedInvoicePath = null;
            if ($request->hasFile('uploaded_invoice')) {
                $uploadedInvoicePath = $request->file('uploaded_invoice')->store('invoices', 'public');
            }

            // Update all vehicles
            foreach ($vehicles as $vehicle) {
                $updateData = [
                    'status' => $validated['close_type'],
                ];

                if ($validated['close_type'] === 'converted') {
                    $updateData['invoice_no'] = $validated['invoice_no'];
                    if ($uploadedInvoicePath) {
                        $updateData['uploaded_invoice'] = $uploadedInvoicePath;
                    }
                } else {
                    $updateData['close_reason'] = $validated['unrealized_reason'];
                }

                $vehicle->update($updateData);
            }

            // Update lead status to closed
            $lead->update(['status' => 'Closed']);

            DB::commit();

            Log::info('Entire lead closed successfully:', [
                'lead_id' => $leadId,
                'close_type' => $validated['close_type'],
                'vehicles_affected' => $vehicles->count()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Entire lead closed successfully',
                'data' => [
                    'lead' => $lead,
                    'vehicles_count' => $vehicles->count()
                ]
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to close entire lead:', [
                'lead_id' => $leadId,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to close entire lead: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function updateLeadStatus(Request $request, $leadId): JsonResponse
    {
        Log::info('Update lead status request:', [
            'lead_id' => $leadId,
            'request_data' => $request->all()
        ]);

        try {
            $validated = $request->validate([
                'status' => 'required|string|in:Open,Closed,converted,Unrealized,Draft'
            ]);

            $lead = Lead::find($leadId);
            if (!$lead) {
                return response()->json([
                    'success' => false,
                    'message' => 'Lead not found'
                ], 404);
            }

            $lead->update(['status' => $validated['status']]);

            Log::info('Lead status updated successfully:', [
                'lead_id' => $leadId,
                'new_status' => $validated['status']
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Lead status updated successfully',
                'data' => $lead
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Failed to update lead status:', [
                'lead_id' => $leadId,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update lead status: ' . $e->getMessage(),
            ], 500);
        }
    }


    // public function updateLeadStatus(Request $request, $leadId): JsonResponse
    // {
    //     Log::info('Update lead status request:', [
    //         'lead_id' => $leadId,
    //         'request_data' => $request->all()
    //     ]);

    //     try {
    //         $validated = $request->validate([
    //             'status' => 'required|string|in:Open,Closed,Converted,Unrealized,Draft'
    //         ]);

    //         $lead = Lead::find($leadId);
    //         if (!$lead) {
    //             return response()->json([
    //                 'success' => false,
    //                 'message' => 'Lead not found'
    //             ], 404);
    //         }

    //         $lead->update(['status' => $validated['status']]);

    //         Log::info('Lead status updated successfully:', [
    //             'lead_id' => $leadId,
    //             'new_status' => $validated['status']
    //         ]);

    //         return response()->json([
    //             'success' => true,
    //             'message' => 'Lead status updated successfully',
    //             'data' => $lead
    //         ], 200);

    //     } catch (\Illuminate\Validation\ValidationException $e) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Validation failed',
    //             'errors' => $e->errors()
    //         ], 422);
    //     } catch (\Exception $e) {
    //         Log::error('Failed to update lead status:', [
    //             'lead_id' => $leadId,
    //             'error' => $e->getMessage()
    //         ]);

    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Failed to update lead status: ' . $e->getMessage(),
    //         ], 500);
    //     }
    // }

    /**
     * Get lead with full details including vehicles
     */
    public function getLeadWithDetails($leadId): JsonResponse
    {
        try {
            $lead = Lead::with([
                'details.brand',
                'details.variant',
                'details.color',
                'details.variant.brand'
            ])->find($leadId);

            if (!$lead) {
                return response()->json([
                    'success' => false,
                    'message' => 'Lead not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $lead,
                'message' => 'Lead details retrieved successfully'
            ], 200);

        } catch (\Exception $e) {
            Log::error('Failed to fetch lead details:', [
                'lead_id' => $leadId,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch lead details: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Bulk close multiple vehicles
     */
    public function bulkCloseVehicles(Request $request): JsonResponse
    {
        Log::info('Bulk close vehicles request:', $request->all());

        try {
            $validated = $request->validate([
                'vehicle_ids' => 'required|array',
                'vehicle_ids.*' => 'integer|exists:lead_details,id',
                'status' => 'required|string|in:converted,Unrealized',
                'close_reason' => 'nullable:status,Unrealized|string|nullable',
                'invoice_no' => 'nullable:status,converted|string|nullable',
            ]);

            DB::beginTransaction();

            $vehicles = LeadDetail::whereIn('id', $validated['vehicle_ids'])->get();

            $updatedCount = 0;
            foreach ($vehicles as $vehicle) {
                $updateData = ['status' => $validated['status']];

                if ($validated['status'] === 'converted') {
                    $updateData['invoice_no'] = $validated['invoice_no'];
                } else {
                    $updateData['close_reason'] = $validated['close_reason'];
                }

                $vehicle->update($updateData);
                $updatedCount++;
            }

            // Update lead statuses if all vehicles in a lead are closed
            $leadIds = $vehicles->pluck('lead_id')->unique();
            foreach ($leadIds as $leadId) {
                $openVehiclesCount = LeadDetail::where('lead_id', $leadId)
                    ->where('status', 'Open')
                    ->count();

                if ($openVehiclesCount === 0) {
                    Lead::where('id', $leadId)->update(['status' => 'Closed']);
                }
            }

            DB::commit();

            Log::info('Bulk close completed:', [
                'vehicles_updated' => $updatedCount,
                'leads_affected' => $leadIds->count()
            ]);

            return response()->json([
                'success' => true,
                'message' => "Successfully closed {$updatedCount} vehicles",
                'data' => [
                    'vehicles_updated' => $updatedCount,
                    'leads_affected' => $leadIds->count()
                ]
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Bulk close vehicles failed:', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to close vehicles: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function openCount()
    {
        $count = \App\Models\LeadDetail::where('status', 'Open')->count();

        return response()->json([
            'data' => $count,
            'message' => 'Open leads count retrieved successfully.'
        ]);
    }

    public function convertedCount(): JsonResponse
    {
        try {
            $count = Lead::where('status', 'converted')->count();

            return response()->json([
                'success' => true,
                'data' => $count,
                'message' => 'Converted leads count retrieved successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve converted leads count.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get Unrealized leads count
     */
    public function unrealizedCount(): JsonResponse
    {
        try {
            $count = Lead::where('status', 'Unrealized')->count();

            return response()->json([
                'success' => true,
                'data' => $count,
                'message' => 'Unrealized leads count retrieved successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve Unrealized leads count.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all converted leads with details
     */
    public function getConvertedLeads(): JsonResponse
    {
        try {
            $leads = LeadDetail::with(['lead_details.brand', 'lead_details.variant', 'lead_details.color'])
                ->where('status', 'converted')
                ->orderBy('updated_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $leads,
                'message' => 'Converted leads retrieved successfully.',
                'count' => $leads->count()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve converted leads.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all Unrealized leads with details
     */
    public function getUnrealizedLeads(): JsonResponse
    {
        try {
            $leads = LeadDetail::with(['lead_details.brand', 'lead_details.variant', 'lead_details.color'])
                ->where('status', 'Unrealized')
                ->orderBy('updated_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $leads,
                'message' => 'Unrealized leads retrieved successfully.',
                'count' => $leads->count()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve Unrealized leads.',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    // Add this temporary method to your LeadApiController
    public function debugDraft()
    {
        try {
            // Get raw data from lead_details
            $rawDetails = LeadDetail::with(['lead', 'brand', 'variant', 'color'])
                ->where('status', 'Draft')
                ->get();

            Log::info('RAW DRAFT LEAD_DETAILS:', [
                'count' => $rawDetails->count(),
                'data' => $rawDetails->toArray()
            ]);

            return response()->json([
                'debug' => true,
                'raw_count' => $rawDetails->count(),
                'raw_data' => $rawDetails,
                'message' => 'Debug information'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateLeadWithVehicles(Request $request, $leadId)
    {
        Log::info('Update lead with vehicles:', [
            'lead_id' => $leadId,
            'request_data' => $request->all()
        ]);

        try {
            $validated = $request->validate([
                'customer_name' => 'required|string|max:255',
                'phone_no' => 'required|string|regex:/^\d{10}$/',
                'location' => 'nullable|string|max:255',
                'area' => 'nullable|string|max:255',
                'tentative_purchase_date' => 'nullable|date',
                'vehicle_qty' => 'required|integer|min:1',
                'payment_mode' => 'required|string|in:cash,finance',
                'additional_note' => 'nullable|string',
                'status' => 'required|string|in:Draft,Open',
                'vehicles' => 'required|array|min:1',
                'vehicles.*.id' => 'nullable|integer|exists:lead_details,id',
                'vehicles.*.brand_id' => 'required|integer|exists:brands,id',
                'vehicles.*.variant_id' => 'required|integer|exists:variants,id',
                'vehicles.*.color_id' => 'nullable|integer|exists:colors,id',
            ]);

            DB::beginTransaction();

            // Update the main lead
            $lead = Lead::findOrFail($leadId);
            $lead->update([
                'customer_name' => $validated['customer_name'],
                'phone_no' => $validated['phone_no'],
                'location' => $validated['location'],
                'area' => $validated['area'],
                'tentative_purchase_date' => $validated['tentative_purchase_date'],
                'vehicle_qty' => $validated['vehicle_qty'],
                'payment_mode' => $validated['payment_mode'],
                'additional_note' => $validated['additional_note'],
                'status' => $validated['status'],
            ]);

            $existingVehicleIds = [];

            // Process each vehicle
            foreach ($validated['vehicles'] as $vehicleData) {
                if (!empty($vehicleData['id'])) {
                    // Update existing vehicle
                    $leadDetail = LeadDetail::where('id', $vehicleData['id'])
                        ->where('lead_id', $leadId)
                        ->first();

                    if ($leadDetail) {
                        $leadDetail->update([
                            'brand_id' => $vehicleData['brand_id'],
                            'variant_id' => $vehicleData['variant_id'],
                            'color_id' => $vehicleData['color_id'] ?? null,
                            'status' => $validated['status'],
                        ]);
                        $existingVehicleIds[] = $vehicleData['id'];
                    }
                } else {
                    // Create new vehicle
                    $newLeadDetail = LeadDetail::create([
                        'lead_id' => $leadId,
                        'brand_id' => $vehicleData['brand_id'],
                        'variant_id' => $vehicleData['variant_id'],
                        'color_id' => $vehicleData['color_id'] ?? null,
                        'status' => $validated['status'],
                    ]);
                    $existingVehicleIds[] = $newLeadDetail->id;
                }
            }

            // Delete vehicles that were removed from the UI
            LeadDetail::where('lead_id', $leadId)
                ->whereNotIn('id', $existingVehicleIds)
                ->delete();

            DB::commit();

            // Reload the lead with relationships
            $updatedLead = Lead::with(['leadDetails.brand', 'leadDetails.variant', 'leadDetails.color'])
                ->find($leadId);

            return response()->json([
                'success' => true,
                'message' => 'Lead updated successfully',
                'data' => $updatedLead
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Update lead failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update lead: ' . $e->getMessage()
            ], 500);
        }
    }
}
