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
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Collection;

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





    public function index(Request $request): JsonResponse
    {
        try {
            $query = Lead::with('leadDetails'); // Include leadDetails

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
            'vehicle_qty' => 'required|integer|min:1|max:10',
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
    public function update(LeadRequest $request, int $id): JsonResponse
    {
        $validated = $request->validated();
        $vehicles = $request->input('vehicles', []); // All vehicles from UI

        try {
            DB::beginTransaction();

            $lead = Lead::findOrFail($id);

            // 1. Update only the lead fields
            $lead->update([
                'customer_name' => $validated['customer_name'],
                'phone_no' => $validated['phone_no'],
                'location' => $request->location,
                'area' => $request->area,
                'tentative_purchase_date' => $request->tentative_purchase_date,
                'vehicle_qty' => count($vehicles),
                'payment_mode' => $validated['payment_mode'],
                'additional_note' => $request->additional_note,
                'status' => $validated['status'],
            ]);

            // 2. ONLY ADD NEW VEHICLES — NEVER DELETE OLD ONES
            foreach ($vehicles as $v) {
                // Skip if already exists in DB (by id)
                if (!empty($v['id']) && LeadDetail::where('id', $v['id'])->exists()) {
                    continue; // Already in DB → skip
                }

                // Insert only new vehicles
                LeadDetail::create([
                    'lead_id' => $lead->id,
                    'brand_id' => $v['brand_id'],
                    'variant_id' => $v['variant_id'],
                    'color_id' => $v['color_id'] ?? null,
                    'status' => 'Draft',
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'New vehicle added successfully!',
                'lead_id' => $lead->id,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Lead update failed: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to add vehicle: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified lead detail.
     */
    public function destroy($id)
    {
        \Log::info('Deleting lead detail:', ['id' => $id]);

        try {
            // Find the lead detail (not the lead)
            $leadDetail = LeadDetail::find($id);

            if (!$leadDetail) {
                \Log::warning('Lead detail not found for deletion:', ['id' => $id]);
                return response()->json([
                    'success' => false,
                    'message' => 'Lead detail not found'
                ], 404);
            }

            $leadId = $leadDetail->lead_id;
            Log::info('Found lead detail:', [
                'detail_id' => $id,
                'lead_id' => $leadId
            ]);

            // Delete only the lead detail
            $leadDetail->delete();

            Log::info('Lead detail deleted successfully:', ['id' => $id]);

            return response()->json([
                'success' => true,
                'message' => 'Lead detail deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            Log::error('Lead detail deletion failed:', [
                'id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete lead detail: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get variants by brand ID (AJAX-like).
     */
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


    /**
     * Get draft leads from lead_details table
     */
    //my wla code hain bhai
    public function draft()
    {
        $details = LeadDetail::with(['brand', 'variant', 'color']) // <-- ADD THIS
            ->where('status', 'Draft')
            ->get()
            ->map(function ($detail) {
                return [
                    'id' => $detail->id,
                    'lead_id' => $detail->lead_id,
                    'customer_name' => $detail->lead->customer_name,
                    'phone_no' => $detail->lead->phone_no,
                    'location' => $detail->lead->location,
                    'area' => $detail->lead->area,
                    'payment_mode' => $detail->lead->payment_mode,
                    'tentative_purchase_date' => $detail->lead->tentative_purchase_date,
                    'vehicle_qty' => $detail->lead->vehicle_qty,
                    'additional_note' => $detail->lead->additional_note,
                    'status' => $detail->status,
                    'created_at' => $detail->created_at,
                    'updated_at' => $detail->updated_at,

                    // Relations
                    'brand_id' => $detail->brand_id,
                    'variant_id' => $detail->variant_id,
                    'color_id' => $detail->color_id,

                    'brand' => $detail->brand ? [
                        'id' => $detail->brand->id,
                        'name' => $detail->brand->name,
                    ] : null,

                    'variant' => $detail->variant ? [
                        'id' => $detail->variant->id,
                        'name' => $detail->variant->name,
                    ] : null,

                    'color' => $detail->color ? [
                        'id' => $detail->color->id,
                        'name' => $detail->color->name,
                        'color_name' => $detail->color->color_name,
                        'color_code' => $detail->color->color_code,
                    ] : null,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $details,
        ]);
    }



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

    /**
     * Submit Draft - Convert ALL vehicles to Open status
     */
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

    public function updateStatus(Request $request, $leadId)
    {
        Log::info('Update status request:', [
            'lead_id' => $leadId,
            'request_data' => $request->all()
        ]);

        try {
            $validated = $request->validate([
                'status' => 'required|string|in:Open,closed', // ✅ ADDED "closed"
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

            \Log::info('Status updated successfully:', [
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
            \Log::error('Update lead status failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update lead status: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete complete lead with all its details
     */
    public function destroyCompleteLead($leadId)
    {
        \Log::info('Deleting complete lead:', ['lead_id' => $leadId]);

        try {
            DB::beginTransaction();

            // Find the lead
            $lead = Lead::find($leadId);

            if (!$lead) {
                \Log::warning('Lead not found for deletion:', ['lead_id' => $leadId]);
                return response()->json([
                    'success' => false,
                    'message' => 'Lead not found'
                ], 404);
            }

            // Delete all lead details first
            LeadDetail::where('lead_id', $leadId)->delete();

            // Then delete the main lead
            $lead->delete();

            DB::commit();

            \Log::info('Complete lead deleted successfully:', ['lead_id' => $leadId]);

            return response()->json([
                'success' => true,
                'message' => 'Lead and all associated details deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Complete lead deletion failed:', [
                'lead_id' => $leadId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete lead: ' . $e->getMessage(),
            ], 500);
        }
    }


    public function addVehicle(Request $request, $leadId): JsonResponse
    {
        \Log::info('Add vehicle:', ['lead_id' => $leadId]);
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
        \Log::info('Update vehicle request:', [
            'lead_detail_id' => $leadDetailId,
            'request_data' => $request->all()
        ]);

        try {
            // Validate the request
            $validated = $request->validate([
                'brand_id' => 'required|integer|exists:brands,id',
                'variant_id' => 'required|integer|exists:variants,id',
                'color_id' => 'nullable|integer|exists:colors,id',
                'status' => 'required|string|in:Draft,Open'
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

            \Log::info('Vehicle updated successfully:', [
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
            \Log::error('Failed to update vehicle:', [
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

            $leads = Lead::where('status', $status)
                ->with(['details.brand', 'details.variant', 'details.color'])
                ->orderBy('created_at', 'desc')
                ->get();

            // Format the response to match what frontend expects
            $formattedLeads = $leads->map(function ($lead) {
                return [
                    'id' => $lead->id,
                    'customer_name' => $lead->customer_name,
                    'phone_no' => $lead->phone_no,
                    'location' => $lead->location,
                    'tentative_purchase_date' => $lead->tentative_purchase_date,
                    'vehicle_qty' => $lead->vehicle_qty,
                    'payment_mode' => $lead->payment_mode,
                    'status' => $lead->status,
                    'created_at' => $lead->created_at,
                    'updated_at' => $lead->updated_at,
                    'lead_details' => $lead->details->map(function ($detail) {
                        return [
                            'id' => $detail->id,
                            'lead_id' => $detail->lead_id,
                            'brand_id' => $detail->brand_id,
                            'variant_id' => $detail->variant_id,
                            'color_id' => $detail->color_id,
                            'status' => $detail->status,
                            'invoice_no' => $detail->invoice_no,
                            'uploaded_invoice' => $detail->uploaded_invoice,
                            'brand' => $detail->brand ? [
                                'id' => $detail->brand->id,
                                'name' => $detail->brand->name
                            ] : null,
                            'variant' => $detail->variant ? [
                                'id' => $detail->variant->id,
                                'name' => $detail->variant->name
                            ] : null,
                            'color' => $detail->color ? [
                                'id' => $detail->color->id,
                                'name' => $detail->color->name,
                                'color_code' => $detail->color->color_code
                            ] : null
                        ];
                    })
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $formattedLeads,
                'message' => $leads->isEmpty() ? "No $status leads found." : "$status leads retrieved successfully."
            ], 200);

        } catch (\Throwable $e) {
            \Log::error('Failed to fetch leads by status: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch leads.',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    public function closeVehicle(Request $request, $leadDetailId): JsonResponse
    {
        Log::info('=== CLOSE VEHICLE DEBUG START ===');
        Log::info('Request method: ' . $request->method());
        Log::info('Request URL: ' . $request->fullUrl());
        Log::info('Request all data:', $request->all());
        Log::info('Request files:', $request->files->all());
        Log::info('Content-Type: ' . $request->header('Content-Type'));

        try {
            DB::beginTransaction();

            // Find the lead detail
            $leadDetail = LeadDetail::with('lead')->find($leadDetailId);
            if (!$leadDetail) {
                Log::error('Vehicle not found: ' . $leadDetailId);
                return response()->json([
                    'success' => false,
                    'message' => 'Vehicle not found'
                ], 404);
            }

            Log::info('Found vehicle:', [
                'id' => $leadDetail->id,
                'lead_id' => $leadDetail->lead_id,
                'current_status' => $leadDetail->status
            ]);

            $leadId = $leadDetail->lead_id;

            // DEBUG: Log all request parameters
            Log::info('Request parameters:');
            foreach ($request->all() as $key => $value) {
                Log::info("  $key: " . (is_string($value) ? $value : json_encode($value)));
            }

            // Determine status based on request data
            $status = null;
            $updateData = [];

            // Check if this is a converted lead (has invoice data)
            if ($request->has('invoice_no') || $request->hasFile('uploaded_invoice')) {
                Log::info('Detected converted lead request');
                $status = 'converted';

                // Validate converted lead data with more permissive rules for debugging
                $convertedValidated = $request->validate([
                    'invoice_no' => 'nullable|string',
                    'uploaded_invoice' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
                ]);

                Log::info('Converted validation passed:', $convertedValidated);

                $updateData['invoice_no'] = $convertedValidated['invoice_no'];

                // Handle file upload for invoice copy
                if ($request->hasFile('uploaded_invoice')) {
                    $uploadedInvoicePath = $request->file('uploaded_invoice')->store('invoices', 'public');
                    $updateData['uploaded_invoice'] = $uploadedInvoicePath;
                    Log::info('Invoice file uploaded to: ' . $uploadedInvoicePath);
                }
            }
            // Check if this is an unrealized lead (has close_reason)
            else if ($request->has('close_reason')) {
                Log::info('Detected unrealized lead request');
                $status = 'unrealized';

                // Validate unrealized lead data
                $unrealizedValidated = $request->validate([
                    'close_reason' => 'required|string',
                ]);

                Log::info('Unrealized validation passed:', $unrealizedValidated);

                $updateData['close_reason'] = $unrealizedValidated['close_reason'];
            }
            // If neither, it's an invalid request
            else {
                Log::error('Invalid request - neither invoice_no nor close_reason provided');
                Log::info('Available request data:', $request->all());
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid request: Either invoice_no or close_reason is required',
                    'debug_data' => $request->all()
                ], 422);
            }

            // Set the status in update data
            $updateData['status'] = $status;

            Log::info('Updating vehicle with data:', $updateData);

            // Update the lead detail
            $leadDetail->update($updateData);

            // Check if all vehicles in the lead are closed
            $openVehiclesCount = LeadDetail::where('lead_id', $leadId)
                ->where('status', 'Open')
                ->count();

            Log::info('Open vehicles count after update: ' . $openVehiclesCount);

            // If no open vehicles left, close the entire lead
            if ($openVehiclesCount === 0) {
                Lead::where('id', $leadId)->update(['status' => 'Closed']);
                Log::info('Lead marked as closed: ' . $leadId);
            }

            DB::commit();

            Log::info('Vehicle closed successfully:', [
                'lead_detail_id' => $leadDetailId,
                'status' => $status,
                'update_data' => $updateData
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Vehicle closed successfully',
                'data' => $leadDetail->fresh(['brand', 'variant', 'color'])
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::error('Validation failed in closeVehicle:', [
                'errors' => $e->errors(),
                'request_data' => $request->all(),
                'files' => $request->files->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
                'debug_info' => [
                    'received_data' => $request->all(),
                    'received_files' => array_keys($request->files->all())
                ]
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to close vehicle:', [
                'lead_detail_id' => $leadDetailId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to close vehicle: ' . $e->getMessage(),
            ], 500);
        } finally {
            Log::info('=== CLOSE VEHICLE DEBUG END ===');
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
                'close_type' => 'required|string|in:converted,unrealized',
                'unrealized_reason' => 'required_if:close_type,unrealized|string|nullable',
                'invoice_no' => 'nullable:close_type,converted|string|nullable',
                'uploaded_invoice' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
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
                'status' => 'required|string|in:Open,Closed,Converted,Unrealized,Draft'
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
                'status' => 'required|string|in:converted,unrealized',
                'close_reason' => 'nullable:status,unrealized|string|nullable',
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
}
