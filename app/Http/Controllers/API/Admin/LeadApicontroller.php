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
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;


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
            $query = Lead::with([
                'lead_details.brand',
                'lead_details.variant',
                'lead_details.color',
                'dealer',
                'distributor'
            ]);

            // Optional: Filter by status if provided in query param
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            $leads = $query->get();

            // Transform the response to include vehicle_qty
            $transformedLeads = $leads->map(function ($lead) {
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
                    'dealer_name' => $lead->dealer ? $lead->dealer->name : null, // ADD THIS
                    'distributor_name' => $lead->distributor ? $lead->distributor->name : null, // ADD THIS
                    'created_at' => $lead->created_at,
                    'updated_at' => $lead->updated_at,
                    'lead_details' => $lead->lead_details->map(function ($detail) {
                        return [
                            'id' => $detail->id,
                            'lead_id' => $detail->lead_id,
                            'brand_id' => $detail->brand_id,
                            'variant_id' => $detail->variant_id,
                            'color_id' => $detail->color_id,
                            'vehicle_qty' => $detail->vehicle_qty, // ✅ ADD THIS
                            'status' => $detail->status,
                            'invoice_no' => $detail->invoice_no,
                            'uploaded_invoice' => $detail->uploaded_invoice,
                            'close_reason' => $detail->close_reason,
                            'created_at' => $detail->created_at,
                            'updated_at' => $detail->updated_at,
                            'brand_name' => $detail->brand ? $detail->brand->name : null,
                            'variant_name' => $detail->variant ? $detail->variant->name : null,
                            'color_name' => $detail->color ? ($detail->color->color_name ?? $detail->color->name) : null,
                            'color_code' => $detail->color ? $detail->color->color_code : null,
                        ];
                    })
                ];
            });

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
                'data' => $transformedLeads,
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






    // public function store(Request $request)
    // {
    //     Log::info('LEAD STORE REQUEST:', $request->all());

    //     $rules = [
    //         'customer_name' => 'required|string|max:255',
    //         'phone_no' => 'required|string|regex:/^\d{10}$/',
    //         'vehicle_qty' => 'required|integer|min:1',
    //         'brand_id' => 'required|integer|exists:brands,id',
    //         'variant_id' => 'required|integer|exists:variants,id',
    //         'color_id' => $request->status === 'Open' ? 'required|integer|exists:colors,id' : 'nullable|integer|exists:colors,id',
    //         'status' => 'required|in:Draft,Open',
    //         'city_id' => 'nullable|exists:cities,id',
    //         'area_id' => 'nullable|exists:areas,id',
    //         'executive_id' => 'nullable|integer|exists:users,id',
    //         // ADD DEALER AND DISTRIBUTOR FIELDS
    //         'dealer_id' => 'nullable|integer|exists:users,id',
    //         'distributor_id' => 'nullable|integer|exists:users,id',
    //     ];

    //     if ($request->has('variant_id')) {
    //         $rules['current_vehicle_qty'] = 'required|integer|min:1';
    //     }

    //     $validated = $request->validate($rules);

    //     try {
    //         DB::beginTransaction();

    //         $leadId = $request->lead_id;
    //         $finalStatus = $validated['status'];

    //         // Get variant and calculate price based on color
    //         $variant = Variant::findOrFail($validated['variant_id']);
    //         $colorId = $validated['color_id'];

    //         // Get price for specific color
    //         $basicPrice = $variant->getPriceForColor($colorId);
    //         $thisVehicleQty = $validated['current_vehicle_qty'] ?? 1;
    //         $totalPrice = $basicPrice * $thisVehicleQty;

    //         // Lead data - INCLUDE DEALER AND DISTRIBUTOR
    //         $leadData = [
    //             'customer_name' => $validated['customer_name'],
    //             'phone_no' => $validated['phone_no'],
    //             'location' => $request->location,
    //             'area' => $request->area,
    //             'city_id' => $validated['city_id'],
    //             'area_id' => $validated['area_id'],
    //             'executive_id' => $validated['executive_id'] ?? auth()->id(),
    //             'tentative_purchase_date' => $request->tentative_purchase_date,
    //             'vehicle_qty' => $validated['vehicle_qty'],
    //             'payment_mode' => $request->payment_mode,
    //             'additional_note' => $request->additional_note,
    //             'status' => $finalStatus,
    //             // ADD THESE FIELDS
    //             'dealer_id' => $request->dealer_id,
    //             'distributor_id' => $request->distributor_id,
    //         ];

    //         Log::info('Creating/Updating lead with data:', $leadData);

    //         if ($leadId) {
    //             $lead = Lead::findOrFail($leadId);
    //             $lead->update($leadData);
    //         } else {
    //             $lead = Lead::create($leadData);
    //             $leadId = $lead->id;
    //         }

    //         // Convert ALL Draft → Open when submitting
    //         if ($finalStatus === 'Open') {
    //             LeadDetail::where('lead_id', $leadId)
    //                 ->where('status', 'Draft')
    //                 ->update(['status' => 'Open']);
    //         }

    //         // Save/Update current vehicle with color-specific price
    //         $exists = LeadDetail::where('lead_id', $leadId)
    //             ->where('variant_id', $validated['variant_id'])
    //             ->where('color_id', $colorId)
    //             ->where('status', $finalStatus)
    //             ->exists();

    //         if (!$exists) {
    //             LeadDetail::create([
    //                 'lead_id' => $leadId,
    //                 'brand_id' => $validated['brand_id'],
    //                 'variant_id' => $validated['variant_id'],
    //                 'color_id' => $colorId,
    //                 'status' => $finalStatus,
    //                 'vehicle_qty' => $thisVehicleQty,
    //                 'total_price' => $totalPrice,
    //                 'unit_price' => $basicPrice,
    //             ]);
    //         } else {
    //             LeadDetail::where('lead_id', $leadId)
    //                 ->where('variant_id', $validated['variant_id'])
    //                 ->where('color_id', $colorId)
    //                 ->where('status', $finalStatus)
    //                 ->update([
    //                     'vehicle_qty' => $thisVehicleQty,
    //                     'total_price' => $totalPrice,
    //                     'unit_price' => $basicPrice,
    //                 ]);
    //         }

    //         DB::commit();

    //         // Return the lead with dealer/distributor info
    //         $leadWithDetails = Lead::with(['details.brand', 'details.variant', 'details.color'])->find($leadId);

    //         return response()->json([
    //             'success' => true,
    //             'lead' => $leadWithDetails,
    //             'lead_id' => $leadId,
    //             'dealer_id' => $leadWithDetails->dealer_id,
    //             'distributor_id' => $leadWithDetails->distributor_id,
    //             'message' => $finalStatus === 'Draft' ? 'Draft saved!' : 'Lead submitted!',
    //         ]);

    //     } catch (\Exception $e) {
    //         DB::rollBack();
    //         Log::error('LEAD STORE FAILED:', ['error' => $e->getMessage()]);
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Failed: ' . $e->getMessage(),
    //         ], 500);
    //     }
    // }




    //deepseek
    public function addVehicleToLead(Request $request, $leadId): JsonResponse
    {
        Log::info('Add vehicle to lead:', ['lead_id' => $leadId, 'data' => $request->all()]);

        try {
            $validated = $request->validate([
                'brand_id' => 'required|integer|exists:brands,id',
                'variant_id' => 'required|integer|exists:variants,id',
                'color_id' => 'nullable|integer|exists:colors,id',
                'quantity' => 'nullable|integer|min:1',
                'status' => 'required|in:Draft,Open',
            ]);

            $lead = Lead::findOrFail($leadId);

            DB::beginTransaction();

            $variant = Variant::findOrFail($validated['variant_id']);
            $colorId = $validated['color_id'];

            // Get price for specific color
            $basicPrice = $colorId ? $variant->getPriceForColor($colorId) : ($variant->basic_price ?? 0);
            $totalPrice = $basicPrice * $validated['quantity'];

            // Create vehicle entry
            $vehicle = LeadDetail::create([
                'lead_id' => $leadId,
                'brand_id' => $validated['brand_id'],
                'variant_id' => $validated['variant_id'],
                'color_id' => $colorId,
                'status' => $validated['status'],
                'vehicle_qty' => $validated['quantity'],
                'total_price' => $totalPrice,
                'unit_price' => $basicPrice,
            ]);

            // Update lead's total vehicle quantity
            $totalVehicleQty = LeadDetail::where('lead_id', $leadId)->sum('vehicle_qty');
            $lead->update(['vehicle_qty' => $totalVehicleQty]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Vehicle added successfully',
                'vehicle' => $vehicle->load(['brand', 'variant', 'color']),
                'total_vehicles' => $totalVehicleQty,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Add vehicle failed:', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to add vehicle: ' . $e->getMessage(),
            ], 500);
        }
    }


    public function store(Request $request)
    {
        Log::info('LEAD STORE REQUEST:', $request->all());

        $rules = [
            'customer_name' => 'required|string|max:255',
            'phone_no' => 'required|string|regex:/^\d{10}$/',
            'vehicle_qty' => 'required|integer|min:1',
            'status' => 'required|in:Draft,Open',
            'city_id' => 'nullable|exists:cities,id',
            'area_id' => 'nullable|exists:areas,id',
            'executive_id' => 'nullable|integer|exists:users,id',
            'dealer_id' => 'nullable|integer|exists:users,id',
            'distributor_id' => 'nullable|integer|exists:users,id',
            'vehicles' => 'nullable|array',
            'vehicles.*.brand_id' => 'required_with:vehicles|integer|exists:brands,id',
            'vehicles.*.variant_id' => 'required_with:vehicles|integer|exists:variants,id',
            'vehicles.*.color_id' => 'nullable|integer|exists:colors,id',
            'vehicles.*.quantity' => 'required_with:vehicles|integer|min:1',
        ];

        $validated = $request->validate($rules);

        try {
            DB::beginTransaction();
            $leadId = $request->lead_id;
            $finalStatus = $validated['status'];

            // Lead data
            $leadData = [
                'customer_name' => $validated['customer_name'],
                'phone_no' => $validated['phone_no'],
                'location' => $request->location,
                'area' => $request->area,
                'city_id' => $validated['city_id'] ?? null,
                'area_id' => $validated['area_id'] ?? null,
                'executive_id' => $validated['executive_id'] ?? auth()->id(),
                'tentative_purchase_date' => $request->tentative_purchase_date,
                'vehicle_qty' => $validated['vehicle_qty'],
                'payment_mode' => $request->payment_mode,
                'additional_note' => $request->additional_note,
                'status' => $finalStatus,
                'dealer_id' => $request->dealer_id ?? null,
                'distributor_id' => $request->distributor_id ?? null,
            ];

            Log::info('Creating/Updating lead with data:', $leadData);

            if ($leadId) {
                $lead = Lead::findOrFail($leadId);
                $lead->update($leadData);
            } else {
                $lead = Lead::create($leadData);
                $leadId = $lead->id;
            }

            // Process multiple vehicles if provided
            if (isset($validated['vehicles']) && is_array($validated['vehicles'])) {
                $totalVehicleQty = 0;

                // Delete existing vehicles for this lead if this is a fresh submission
                // This prevents duplication when "Add Another Vehicle" is clicked
                if (!$request->has('is_adding_another_vehicle') || $request->is_adding_another_vehicle == false) {
                    // Only delete if this is NOT "Add Another Vehicle" action
                    LeadDetail::where('lead_id', $leadId)->delete();
                    Log::info('Deleted existing vehicles for lead:', ['lead_id' => $leadId]);
                }

                foreach ($validated['vehicles'] as $vehicleData) {
                    $variant = Variant::findOrFail($vehicleData['variant_id']);
                    $colorId = $vehicleData['color_id'] ?? null;

                    // Get price for specific color
                    $basicPrice = $colorId ? $variant->getPriceForColor($colorId) : ($variant->basic_price ?? 0);
                    $thisVehicleQty = $vehicleData['quantity'] ?? 1;
                    $totalPrice = $basicPrice * $thisVehicleQty;
                    $totalVehicleQty += $thisVehicleQty;

                    // Check if vehicle with same variant and color already exists in THIS lead
                    // Only if "Add Another Vehicle" is true
                    if ($request->has('is_adding_another_vehicle') && $request->is_adding_another_vehicle == true) {
                        $exists = LeadDetail::where('lead_id', $leadId)
                            ->where('variant_id', $vehicleData['variant_id'])
                            ->where('color_id', $colorId)
                            ->where('status', $finalStatus)
                            ->first();

                        if ($exists) {
                            // Update existing vehicle quantity by SUMMING
                            $newQty = $exists->vehicle_qty + $thisVehicleQty;
                            $newTotalPrice = $basicPrice * $newQty;
                            $exists->update([
                                'vehicle_qty' => $newQty,
                                'total_price' => $newTotalPrice,
                                'unit_price' => $basicPrice,
                            ]);

                            Log::info('Updated existing vehicle (summed qty) for Add Another Vehicle:', [
                                'lead_id' => $leadId,
                                'vehicle_id' => $exists->id,
                                'old_qty' => $exists->getOriginal('vehicle_qty'),
                                'added_qty' => $thisVehicleQty,
                                'new_qty' => $newQty
                            ]);
                            continue; // Skip creating new record
                        }
                    }

                    // Create new vehicle entry
                    LeadDetail::create([
                        'lead_id' => $leadId,
                        'brand_id' => $vehicleData['brand_id'],
                        'variant_id' => $vehicleData['variant_id'],
                        'color_id' => $colorId,
                        'status' => $finalStatus,
                        'vehicle_qty' => $thisVehicleQty,
                        'total_price' => $totalPrice,
                        'unit_price' => $basicPrice,
                    ]);

                    Log::info('Created new vehicle:', [
                        'lead_id' => $leadId,
                        'variant_id' => $vehicleData['variant_id'],
                        'color_id' => $colorId,
                        'quantity' => $thisVehicleQty
                    ]);
                }

                // Update lead with actual total vehicle quantity
                $lead->update(['vehicle_qty' => $totalVehicleQty]);
                Log::info('Updated lead vehicle_qty:', ['total' => $totalVehicleQty]);

            } else {
                // Handle single vehicle (backward compatibility)
                if ($request->has('variant_id')) {
                    $variant = Variant::findOrFail($request->variant_id);
                    $colorId = $request->color_id;
                    $basicPrice = $colorId ? $variant->getPriceForColor($colorId) : ($variant->basic_price ?? 0);
                    $thisVehicleQty = $request->current_vehicle_qty ?? 1;
                    $totalPrice = $basicPrice * $thisVehicleQty;

                    // Delete existing vehicle if any
                    LeadDetail::where('lead_id', $leadId)
                        ->where('variant_id', $request->variant_id)
                        ->where('color_id', $colorId)
                        ->delete();

                    LeadDetail::create([
                        'lead_id' => $leadId,
                        'brand_id' => $request->brand_id,
                        'variant_id' => $request->variant_id,
                        'color_id' => $colorId,
                        'status' => $finalStatus,
                        'vehicle_qty' => $thisVehicleQty,
                        'total_price' => $totalPrice,
                        'unit_price' => $basicPrice,
                    ]);
                }
            }

            // Convert ALL Draft → Open when submitting
            if ($finalStatus === 'Open') {
                LeadDetail::where('lead_id', $leadId)
                    ->where('status', 'Draft')
                    ->update(['status' => 'Open']);
            }

            DB::commit();

            // Return the lead with dealer/distributor info
            $leadWithDetails = Lead::with(['details.brand', 'details.variant', 'details.color'])->find($leadId);

            return response()->json([
                'success' => true,
                'lead' => $leadWithDetails,
                'lead_id' => $leadId,
                'dealer_id' => $leadWithDetails->dealer_id,
                'distributor_id' => $leadWithDetails->distributor_id,
                'message' => $finalStatus === 'Draft' ? 'Draft saved!' : 'Lead submitted!',
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('LEAD STORE FAILED:', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id): JsonResponse
    {
        Log::info('UPDATE REQUEST DATA:', $request->all());

        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'phone_no' => 'required|string|regex:/^\d{10}$/',
            'location' => 'nullable|string',
            'tentative_purchase_date' => 'nullable|date',
            'payment_mode' => 'required| ',
            'additional_note' => 'nullable|string',
            'status' => 'required|in:Draft,Open',
            'vehicle_qty' => 'required|integer|min:1',
            'vehicles' => 'sometimes|array',
            'vehicles.*.id' => 'nullable|integer|exists:lead_details,id',
            'vehicles.*.brand_id' => 'required_with:vehicles|integer|exists:brands,id',
            'vehicles.*.variant_id' => 'required_with:vehicles|integer|exists:variants,id',
            'vehicles.*.color_id' => 'nullable|integer|exists:colors,id',
            'vehicles.*.vehicle_qty' => 'required_with:vehicles|integer|min:1',
        ]);

        DB::beginTransaction();
        try {
            $lead = Lead::findOrFail($id);

            Log::info('Updating lead:', ['lead_id' => $id, 'data' => $validated]);

            // Update main lead
            $lead->update([
                'customer_name' => $validated['customer_name'],
                'phone_no' => $validated['phone_no'],
                'location' => $validated['location'] ?? null,
                'tentative_purchase_date' => $validated['tentative_purchase_date'] ?? null,
                'payment_mode' => $validated['payment_mode'],
                'additional_note' => $validated['additional_note'] ?? null,
                'status' => $validated['status'],
                'vehicle_qty' => $validated['vehicle_qty'],
            ]);

            // Only process vehicles if they exist in the request
            if (isset($validated['vehicles']) && is_array($validated['vehicles'])) {
                Log::info('Processing vehicles:', ['count' => count($validated['vehicles']), 'vehicles' => $validated['vehicles']]);

                // Get current vehicle IDs
                $existingIds = LeadDetail::where('lead_id', $id)->pluck('id')->toArray();
                $incomingIds = collect($validated['vehicles'])
                    ->pluck('id')
                    ->filter()
                    ->map(fn($id) => (int) $id)
                    ->toArray();

                Log::info('Vehicle IDs - Existing:', $existingIds);
                Log::info('Vehicle IDs - Incoming:', $incomingIds);

                // Delete removed vehicles
                $toDelete = array_diff($existingIds, $incomingIds);
                if ($toDelete) {
                    Log::info('Deleting vehicles:', $toDelete);
                    LeadDetail::whereIn('id', $toDelete)->delete();
                }

                // Update or Create vehicles
                foreach ($validated['vehicles'] as $index => $vehicle) {
                    $data = [
                        'brand_id' => $vehicle['brand_id'],
                        'variant_id' => $vehicle['variant_id'],
                        'color_id' => $vehicle['color_id'] ?? null,
                        'vehicle_qty' => $vehicle['vehicle_qty'] ?? 1,
                        'status' => $validated['status'],
                    ];

                    Log::info("Processing vehicle {$index}:", $vehicle);

                    if (!empty($vehicle['id'])) {
                        // Update existing vehicle
                        $updated = LeadDetail::where('id', $vehicle['id'])
                            ->where('lead_id', $id)
                            ->update($data);

                        Log::info("Updated vehicle {$vehicle['id']}:", ['rows_affected' => $updated]);
                    } else {
                        // Create new vehicle
                        $newVehicle = LeadDetail::create(array_merge($data, [
                            'lead_id' => $id,
                        ]));
                        Log::info("Created new vehicle:", $newVehicle->toArray());
                    }
                }

                // Update total vehicle quantity for the lead
                $totalVehicleQty = LeadDetail::where('lead_id', $id)->sum('vehicle_qty');
                $lead->update(['vehicle_qty' => $totalVehicleQty]);
            }

            DB::commit();

            Log::info('Update completed successfully');

            return response()->json([
                'success' => true,
                'message' => $validated['status'] === 'Draft'
                    ? 'Draft updated successfully!'
                    : 'Lead updated and submitted!',
                'lead' => $lead->fresh(['leadDetails.brand', 'leadDetails.variant', 'leadDetails.color'])
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Lead update failed: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Update failed: ' . $e->getMessage(),
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
                'location' => 'nullable|string',
                'tentative_purchase_date' => 'nullable|date',
                'payment_mode' => 'required| ',
                'additional_note' => 'nullable|string',
                'status' => 'required|in:Draft,Open',
                'vehicles' => 'required|array|min:1',
                'vehicles.*.id' => 'nullable|integer',
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
                'tentative_purchase_date' => $validated['tentative_purchase_date'],
                'payment_mode' => $validated['payment_mode'],
                'additional_note' => $validated['additional_note'],
                'status' => $validated['status'],
                'vehicle_qty' => count($validated['vehicles']),
            ]);

            $existingVehicleIds = [];

            // Process each vehicle
            foreach ($validated['vehicles'] as $vehicleData) {
                $data = [
                    'brand_id' => $vehicleData['brand_id'],
                    'variant_id' => $vehicleData['variant_id'],
                    'color_id' => $vehicleData['color_id'] ?? null,
                    'status' => $validated['status'],
                ];

                if (!empty($vehicleData['id'])) {
                    // Update existing vehicle
                    $leadDetail = LeadDetail::where('id', $vehicleData['id'])
                        ->where('lead_id', $leadId)
                        ->first();

                    if ($leadDetail) {
                        $leadDetail->update($data);
                        $existingVehicleIds[] = $vehicleData['id'];
                    }
                } else {
                    // Create new vehicle
                    $newLeadDetail = LeadDetail::create(array_merge($data, [
                        'lead_id' => $leadId,
                    ]));
                    $existingVehicleIds[] = $newLeadDetail->id;
                }
            }

            // Delete vehicles that were removed from the UI
            LeadDetail::where('lead_id', $leadId)
                ->whereNotIn('id', $existingVehicleIds)
                ->delete();

            DB::commit();

            // Reload the lead with relationships
            $updatedLead = $lead->fresh(['leadDetails.brand', 'leadDetails.variant', 'leadDetails.color']);

            return response()->json([
                'success' => true,
                'message' => 'Lead updated successfully',
                'data' => $updatedLead
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Update lead failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update lead: ' . $e->getMessage()
            ], 500);
        }
    }

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
                    // 'vehicle_qty' => $lead ? $lead->vehicle_qty : 1,
                    'vehicle_qty' => $detail->vehicle_qty, // ✅ ADD THIS

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
                            'vehicle_qty' => $detail->vehicle_qty, // ✅ ADD THIS

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

    // public function show($id)
    // {
    //     $lead = Lead::with([
    //         'details.brand',
    //         'details.variant',
    //         'details.color',
    //         'details.variant.brand'
    //     ])->findOrFail($id);

    //     return response()->json([
    //         'status' => true,
    //         'data' => $lead
    //     ]);
    // }

    public function show($id)
    {
        $lead = Lead::with([
            'details.brand',
            'details.variant',
            'details.color',
            'details.variant.brand'
        ])->findOrFail($id);

        // Transform the response to include vehicle_qty
        $transformedLead = [
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
            'lead_details' => $lead->details->map(function ($detail) {
                return [
                    'id' => $detail->id,
                    'lead_id' => $detail->lead_id,
                    'brand_id' => $detail->brand_id,
                    'variant_id' => $detail->variant_id,
                    'color_id' => $detail->color_id,
                    'vehicle_qty' => $detail->vehicle_qty, // ✅ ADD THIS
                    'status' => $detail->status,
                    'invoice_no' => $detail->invoice_no,
                    'uploaded_invoice' => $detail->uploaded_invoice,
                    'close_reason' => $detail->close_reason,
                    'created_at' => $detail->created_at,
                    'updated_at' => $detail->updated_at,
                    'brand_name' => $detail->brand ? $detail->brand->name : null,
                    'variant_name' => $detail->variant ? $detail->variant->name : null,
                    'color_name' => $detail->color ? ($detail->color->color_name ?? $detail->color->name) : null,
                    'color_code' => $detail->color ? $detail->color->color_code : null,
                    'brand' => $detail->brand,
                    'variant' => $detail->variant,
                    'color' => $detail->color
                ];
            })
        ];

        return response()->json([
            'status' => true,
            'data' => $transformedLead
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
            Log::info('=== DRAFT API CALLED - FIXED COLORS COLUMN ===');

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
                    'ld.vehicle_qty',
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
                    'c.name as color_name',
                    'c.color_code'
                )
                ->get();

            Log::info('Raw draft details count: ' . $draftDetails->count());

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
                    'vehicle_qty' => $item->vehicle_qty ?? 1,
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

            Log::info('Grouped leads count: ' . count($leads));

            return response()->json([
                'success' => true,
                'data' => $leads,
                'count' => count($leads),
                'total_vehicles' => $draftDetails->count(),
                'message' => 'Draft leads retrieved successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Draft API error: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch draft leads: ' . $e->getMessage(),
                'data' => []
            ], 500);
        }
    }

    public function vehicleFilterData(Request $request): JsonResponse
    {
        try {
            $query = Gallery::query()
                ->with([
                    'brand:id,name',
                    'variant:id,name', // Make sure variant relationship exists and is loaded
                    'fuelType:id,name'
                ])
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

            // Transform the response
            $transformedGalleries = $galleries->map(function ($gallery) {
                // Handle cover_photos
                $photos = [];
                if (is_string($gallery->cover_photos)) {
                    $decoded = json_decode($gallery->cover_photos, true);
                    if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                        $photos = $decoded;
                    }
                } elseif (is_array($gallery->cover_photos)) {
                    $photos = $gallery->cover_photos;
                }

                // Build image URLs
                $coverPhotoUrls = [];
                foreach ($photos as $photo) {
                    if (is_string($photo)) {
                        // Clean the path and construct URL
                        $cleanPath = ltrim(str_replace('\\', '/', $photo), '/');

                        // Check if it's already a full URL
                        if (filter_var($cleanPath, FILTER_VALIDATE_URL)) {
                            $coverPhotoUrls[] = $cleanPath;
                        } else {
                            // Construct local storage URL
                            $coverPhotoUrls[] = asset("storage/galleries/" . basename($cleanPath));
                        }
                    }
                }

                // If no photos found, use placeholder
                if (empty($coverPhotoUrls)) {
                    $coverPhotoUrls[] = "https://via.placeholder.com/160x120/f3f4f6/6b7280?text=No+Image";
                }

                return [
                    'id' => $gallery->id,
                    'cover_photos' => $coverPhotoUrls,
                    'brand_name' => $gallery->brand->name ?? 'Unknown Brand',
                    'variant_name' => $gallery->variant->name ?? 'Unknown Variant',
                    'variant_id' => $gallery->variant_id,
                    'brand_id' => $gallery->brand_id,
                    'open_leads_count' => $gallery->open_leads_count ?? 0,
                ];
            });

            return response()->json([
                'success' => true,
                'galleries' => $transformedGalleries,
                'message' => $galleries->isEmpty() ? 'No vehicle models found.' : 'Vehicle models retrieved successfully.'
            ], 200);

        } catch (\Throwable $e) {
            Log::error('Failed to fetch vehicle models: ' . $e->getMessage() . ' in ' . $e->getFile() . ' at line ' . $e->getLine());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch vehicle models.',
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

            // Find the lead
            $lead = Lead::find($leadId);
            if (!$lead) {
                return response()->json([
                    'success' => false,
                    'message' => 'Lead not found'
                ], 404);
            }

            // Update lead status to Open
            $lead->update([
                'status' => 'Open',
                'updated_at' => now()
            ]);

            // ✅ CRITICAL: Convert ALL vehicles from Draft to Open
            $vehiclesUpdated = LeadDetail::where('lead_id', $leadId)
                ->where('status', 'Draft')
                ->update([
                    'status' => 'Open',
                    'updated_at' => now()
                ]);

            DB::commit();

            Log::info('Draft submitted successfully:', [
                'lead_id' => $leadId,
                'lead_status' => 'Open',
                'vehicles_updated' => $vehiclesUpdated
            ]);

            return response()->json([
                'success' => true,
                'lead_id' => $leadId,
                'vehicles_updated' => $vehiclesUpdated,
                'message' => 'Lead submitted successfully!'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Submit draft failed:', [
                'lead_id' => $leadId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to submit lead: ' . $e->getMessage()
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
                'brand_id' => 'nullable|integer|exists:brands,id',
                'variant_id' => 'nullable|integer|exists:variants,id',
                'color_id' => 'nullable|integer', // Remove exists check
                'status' => 'nullable|string|in:Draft,Open'
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


    // public function updateVehicle(Request $request, $leadDetailId): JsonResponse
    // {
    //     Log::info('Update vehicle request:', [
    //         'lead_detail_id' => $leadDetailId,
    //         'request_data' => $request->all()
    //     ]);

    //     try {
    //         // Validate the request
    //         $validated = $request->validate([
    //             'brand_id' => 'required|integer|exists:brands,id',
    //             'variant_id' => 'required|integer|exists:variants,id',
    //             'vehicle_qty' => 'nullable|integer|min:1',
    //             'color_id' => 'nullable|integer|exists:colors,id',
    //             'status' => 'required|string|in:Draft,Open,converted,Unrealized',
    //         ]);

    //         // Find the lead detail
    //         $leadDetail = LeadDetail::find($leadDetailId);
    //         if (!$leadDetail) {
    //             return response()->json([
    //                 'success' => false,
    //                 'message' => 'Vehicle not found'
    //             ], 404);
    //         }

    //         DB::beginTransaction();

    //         // Update the vehicle
    //         $leadDetail->update([
    //             'brand_id' => $validated['brand_id'],
    //             'variant_id' => $validated['variant_id'],
    //             'color_id' => $validated['color_id'] ?? null,
    //             'vehicle_qty' => $validated['vehicle_qty'], // ✅ ADD THIS

    //             'status' => $validated['status'],
    //         ]);

    //         DB::commit();

    //         // Load relationships for response
    //         $leadDetail->load(['brand', 'variant', 'color']);

    //         Log::info('Vehicle updated successfully:', [
    //             'lead_detail_id' => $leadDetailId
    //         ]);

    //         return response()->json([
    //             'success' => true,
    //             'message' => 'Vehicle updated successfully',
    //             'data' => [
    //                 'id' => $leadDetail->id,
    //                 'lead_id' => $leadDetail->lead_id,
    //                 'brand_id' => $leadDetail->brand_id,
    //                 'variant_id' => $leadDetail->variant_id,
    //                 'vehicle_qty' => $leadDetail->vehicle_qty, // ✅ ADD THIS

    //                 'color_id' => $leadDetail->color_id,
    //                 'status' => $leadDetail->status,
    //                 'invoice_no' => $leadDetail->invoice_no,
    //                 'uploaded_invoice' => $leadDetail->uploaded_invoice,
    //                 'brand_name' => $leadDetail->brand->name ?? null,
    //                 'variant_name' => $leadDetail->variant->name ?? null,
    //                 'color_name' => $leadDetail->color->name ?? null,
    //                 'color_code' => $leadDetail->color->color_code ?? null,
    //             ]
    //         ], 200);

    //     } catch (\Illuminate\Validation\ValidationException $e) {
    //         DB::rollBack();
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Validation failed',
    //             'errors' => $e->errors()
    //         ], 422);

    //     } catch (\Exception $e) {
    //         DB::rollBack();
    //         Log::error('Failed to update vehicle:', [
    //             'lead_detail_id' => $leadDetailId,
    //             'error' => $e->getMessage()
    //         ]);

    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Failed to update vehicle: ' . $e->getMessage(),
    //         ], 500);
    //     }
    // }

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
                'vehicle_qty' => 'required|integer|min:1',
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

            // Update the vehicle (without price fields)
            $leadDetail->update([
                'brand_id' => $validated['brand_id'],
                'variant_id' => $validated['variant_id'],
                'color_id' => $validated['color_id'] ?? null,
                'vehicle_qty' => $validated['vehicle_qty'],
                'status' => $validated['status'],
            ]);

            // Update lead's total vehicle quantity
            $lead = Lead::find($leadDetail->lead_id);
            if ($lead) {
                $totalVehicleQty = LeadDetail::where('lead_id', $leadDetail->lead_id)->sum('vehicle_qty');
                $lead->update(['vehicle_qty' => $totalVehicleQty]);
            }

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
                    'vehicle_qty' => $leadDetail->vehicle_qty,
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
    public function getLeadsByStatus(Request $request)
    {
        try {
            $status = $request->query('status');

            $leads = Lead::with([
                'lead_details' => function ($query) {
                    $query->with(['brand', 'variant', 'color', 'variant.colorPrices']);
                }
            ])
                ->where('status', $status)
                ->get();

            // Transform the response to include color pricing
            $transformedLeads = $leads->map(function ($lead) {
                return [
                    'id' => $lead->id,
                    'customer_name' => $lead->customer_name,
                    'phone_no' => $lead->phone_no,
                    'location' => $lead->location,
                    'status' => $lead->status,
                    'payment_mode' => $lead->payment_mode,
                    'created_at' => $lead->created_at,
                    'lead_details' => $lead->lead_details->map(function ($detail) {
                        // Get color-specific price
                        $colorPrice = null;
                        if ($detail->color_id && $detail->variant) {
                            $colorPriceObj = $detail->variant->colorPrices
                                ->where('color_id', $detail->color_id)
                                ->first();
                            $colorPrice = $colorPriceObj ? $colorPriceObj->price : null;
                        }

                        return [
                            'id' => $detail->id,
                            'brand_id' => $detail->brand_id,
                            'variant_id' => $detail->variant_id,
                            'color_id' => $detail->color_id,
                            'vehicle_qty' => $detail->vehicle_qty,
                            'quantity' => $detail->vehicle_qty, // Ensure quantity is available
                            'status' => $detail->status,
                            'brand_name' => $detail->brand->name ?? null,
                            'variant_name' => $detail->variant->name ?? null,
                            'color_name' => $detail->color->name ?? $detail->color->color_name ?? null,
                            'color_code' => $detail->color->color_code ?? null,
                            'unit_price' => $detail->unit_price, // From lead_details table
                            'color_price' => $colorPrice, // Calculated color price
                            'variant' => $detail->variant ? [
                                'id' => $detail->variant->id,
                                'name' => $detail->variant->name,
                                'basic_price' => $detail->variant->basic_price
                            ] : null
                        ];
                    })
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $transformedLeads
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch leads: ' . $e->getMessage()
            ], 500);
        }
    }


    /**
     * Remove a vehicle from lead
     */
    /**
     * Remove a vehicle from lead
     */
    public function removeVehicle($leadId, $vehicleId): JsonResponse
    {
        Log::info('Remove vehicle request:', [
            'lead_id' => $leadId,
            'vehicle_id' => $vehicleId
        ]);

        try {
            DB::beginTransaction();

            // Find the lead detail
            $leadDetail = LeadDetail::where('id', $vehicleId)
                ->where('lead_id', $leadId)
                ->first();

            if (!$leadDetail) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vehicle not found in this lead'
                ], 404);
            }

            // Store the vehicle data before deletion
            $deletedVehicleQty = $leadDetail->vehicle_qty;
            $deletedTotalPrice = $leadDetail->total_price;

            // Delete the vehicle
            $leadDetail->delete();

            // Check if this was the last vehicle in the lead
            $remainingVehicles = LeadDetail::where('lead_id', $leadId)->count();

            if ($remainingVehicles === 0) {
                // If no vehicles left, update the main lead
                $lead = Lead::find($leadId);
                if ($lead) {
                    $lead->update([
                        'status' => 'Draft',
                        'vehicle_qty' => 0
                    ]);
                }
            } else {
                // Update the lead's vehicle count and recalculate prices
                $lead = Lead::find($leadId);
                if ($lead) {
                    // Calculate new total vehicle quantity and price
                    $remainingLeadDetails = LeadDetail::where('lead_id', $leadId)->get();

                    $totalVehicleQty = $remainingLeadDetails->sum('vehicle_qty');
                    $totalPrice = $remainingLeadDetails->sum('total_price');

                    $lead->update([
                        'vehicle_qty' => $totalVehicleQty,
                        // If you have a total_price field in leads table, update it too
                        // 'total_price' => $totalPrice
                    ]);

                    Log::info('Lead updated after vehicle removal:', [
                        'lead_id' => $leadId,
                        'new_vehicle_qty' => $totalVehicleQty,
                        'new_total_price' => $totalPrice
                    ]);
                }
            }

            DB::commit();

            Log::info('Vehicle removed successfully:', [
                'lead_id' => $leadId,
                'vehicle_id' => $vehicleId,
                'remaining_vehicles' => $remainingVehicles,
                'deleted_vehicle_qty' => $deletedVehicleQty,
                'deleted_total_price' => $deletedTotalPrice
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Vehicle removed successfully',
                'remaining_vehicles' => $remainingVehicles,
                'deleted_vehicle' => [
                    'id' => $vehicleId,
                    'vehicle_qty' => $deletedVehicleQty,
                    'total_price' => $deletedTotalPrice
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Remove vehicle failed:', [
                'lead_id' => $leadId,
                'vehicle_id' => $vehicleId,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to remove vehicle: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete specific vehicle from lead
     */
    public function deleteVehicle($leadId, $vehicleId): JsonResponse
    {
        Log::info('Delete vehicle request:', [
            'lead_id' => $leadId,
            'vehicle_id' => $vehicleId
        ]);

        try {
            DB::beginTransaction();

            // Find the vehicle in lead_details table
            $leadDetail = LeadDetail::where('id', $vehicleId)
                ->where('lead_id', $leadId)
                ->first();

            if (!$leadDetail) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vehicle not found in this lead'
                ], 404);
            }

            // Store vehicle info for logging
            $vehicleInfo = [
                'id' => $leadDetail->id,
                'brand_id' => $leadDetail->brand_id,
                'variant_id' => $leadDetail->variant_id,
                'color_id' => $leadDetail->color_id
            ];

            // Delete the vehicle
            $leadDetail->delete();

            // Update the main lead's vehicle count
            $remainingVehicles = LeadDetail::where('lead_id', $leadId)->count();
            $lead = Lead::find($leadId);

            if ($lead) {
                $lead->update([
                    'vehicle_qty' => $remainingVehicles
                ]);

                // If no vehicles left, delete the main lead too or set to draft
                if ($remainingVehicles === 0) {
                    $lead->update(['status' => 'Draft']);
                    Log::info('All vehicles removed, lead set to draft', ['lead_id' => $leadId]);
                }
            }

            DB::commit();

            Log::info('Vehicle deleted successfully:', [
                'lead_id' => $leadId,
                'vehicle_id' => $vehicleId,
                'vehicle_info' => $vehicleInfo,
                'remaining_vehicles' => $remainingVehicles
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Vehicle deleted successfully',
                'remaining_vehicles' => $remainingVehicles
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to delete vehicle:', [
                'lead_id' => $leadId,
                'vehicle_id' => $vehicleId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete vehicle: ' . $e->getMessage(),
            ], 500);
        }
    }




    // public function closeVehicle(Request $request, $leadDetailId): JsonResponse
    // {
    //     Log::info('closeVehicle called', ['leadDetailId' => $leadDetailId, 'data' => $request->all()]);

    //     try {
    //         DB::beginTransaction();

    //         $leadDetail = LeadDetail::with('lead')->find($leadDetailId);
    //         if (!$leadDetail) {
    //             return response()->json(['success' => false, 'message' => 'Vehicle not found'], 404);
    //         }

    //         $leadId = $leadDetail->lead_id;

    //         // Validate based on close_type
    //         $request->validate([
    //             'close_type' => 'nullable|in:converted,Unrealized',
    //             'invoice_no' => 'required_if:close_type,converted|string|nullable',
    //             'uploaded_invoice' => 'nullable:close_type,converted|nullable',
    //             'close_reason' => 'nullable:close_type,Unrealized|string|nullable',
    //             'converted_quantity' => 'required_if:close_type,converted|integer|min:1',
    //             'unit_price' => 'nullable|numeric|min:0',
    //             'total_price' => 'nullable|numeric|min:0',
    //         ]);

    //         $closeType = $request->close_type;
    //         $updateData = ['status' => $closeType];

    //         if ($closeType === 'converted') {
    //             $updateData['invoice_no'] = $request->invoice_no;

    //             // Handle converted quantity
    //             $originalQty = $leadDetail->vehicle_qty;
    //             $convertedQty = $request->converted_quantity;

    //             // Ensure converted quantity doesn't exceed original quantity
    //             if ($convertedQty > $originalQty) {
    //                 return response()->json([
    //                     'success' => false,
    //                     'message' => 'Converted quantity cannot exceed original quantity'
    //                 ], 422);
    //             }

    //             // Store converted quantity - original vehicle_qty remains unchanged
    //             $updateData['converted_qty'] = $convertedQty;

    //             // Use provided total_price or calculate it
    //             if ($request->has('total_price')) {
    //                 $updateData['total_price'] = $request->total_price;
    //             } else {
    //                 $unitPrice = $request->unit_price ?? $leadDetail->unit_price ?? 0;
    //                 $updateData['total_price'] = $unitPrice * $convertedQty;
    //                 $updateData['unit_price'] = $unitPrice;
    //             }

    //             if ($request->hasFile('uploaded_invoice')) {
    //                 $path = $request->file('uploaded_invoice')->store('invoices', 'public');
    //                 $updateData['uploaded_invoice'] = $path;
    //             }

    //             // NO LONGER CREATE NEW ENTRY FOR REMAINING QUANTITY
    //             // Just update the existing record with converted_qty

    //         } else {
    //             $updateData['close_reason'] = $request->close_reason;
    //         }

    //         $leadDetail->update($updateData);

    //         // Update lead's status if needed
    //         $lead = Lead::find($leadId);
    //         if ($lead) {
    //             // Check if this was the last open vehicle
    //             $remainingOpenVehicles = LeadDetail::where('lead_id', $leadId)
    //                 ->where('status', 'Open')
    //                 ->count();

    //             if ($remainingOpenVehicles === 0) {
    //                 $lead->update(['status' => 'Closed']);
    //             }
    //         }

    //         DB::commit();

    //         return response()->json([
    //             'success' => true,
    //             'message' => 'Vehicle converted successfully!',
    //             'data' => $leadDetail->fresh(['brand', 'variant', 'color']),
    //             'original_qty' => $originalQty,
    //             'converted_qty' => $convertedQty,
    //             'remaining_qty' => $originalQty - $convertedQty
    //         ]);

    //     } catch (\Illuminate\Validation\ValidationException $e) {
    //         DB::rollBack();
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Validation failed',
    //             'errors' => $e->errors()
    //         ], 422);
    //     } catch (\Exception $e) {
    //         DB::rollBack();
    //         Log::error('closeVehicle failed', ['error' => $e->getMessage()]);
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Failed to convert vehicle: ' . $e->getMessage()
    //         ], 500);
    //     }
    // }

    //uploaded invoice is stored
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

            // First, validate close_type (required)
            $closeTypeValidator = Validator::make($request->all(), [
                'close_type' => 'required|in:converted,Unrealized'
            ]);

            if ($closeTypeValidator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $closeTypeValidator->errors()
                ], 422);
            }

            $closeType = $request->close_type;
            if (strtolower($closeType) === 'Unrealized') {
                $closeType = 'Unrealized';
            }

            // Now build and validate the rest based on close_type
            $rules = [
                'converted_quantity' => 'nullable|required_if:close_type,converted|integer|min:1',
                'unit_price' => 'nullable|numeric|min:0',
                'total_price' => 'nullable|numeric|min:0',
            ];

            if ($closeType === 'converted') {
                $rules['invoice_no'] = 'required|string';
                $rules['uploaded_invoice'] = 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048';
            } else {
                $rules['close_reason'] = 'required|string';
            }

            // Validate the request
            $validated = $request->validate($rules);

            $updateData = ['status' => $closeType];

            if ($closeType === 'converted') {
                $updateData['invoice_no'] = $validated['invoice_no'];

                // Handle converted quantity
                $originalQty = $leadDetail->vehicle_qty;
                $convertedQty = $validated['converted_quantity'];

                // Ensure converted quantity doesn't exceed original quantity
                if ($convertedQty > $originalQty) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Converted quantity cannot exceed original quantity'
                    ], 422);
                }

                // Store converted quantity - original vehicle_qty remains unchanged
                $updateData['converted_qty'] = $convertedQty;

                // Use provided total_price or calculate it
                if (isset($validated['total_price'])) {
                    $updateData['total_price'] = $validated['total_price'];
                } else {
                    $unitPrice = $validated['unit_price'] ?? $leadDetail->unit_price ?? 0;
                    $updateData['total_price'] = $unitPrice * $convertedQty;
                    $updateData['unit_price'] = $unitPrice;
                }

                // Handle file upload
                if ($request->hasFile('uploaded_invoice')) {
                    try {
                        // Get the file
                        $file = $request->file('uploaded_invoice');

                        // Generate unique filename
                        $filename = 'invoice_' . time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();

                        // Store in public/invoices directory
                        $path = $file->storeAs('public/invoices', $filename);

                        // Save the path in database (without 'public/' prefix for web access)
                        $updateData['uploaded_invoice'] = 'invoices/' . $filename;

                        Log::info('Invoice uploaded successfully:', [
                            'path' => $updateData['uploaded_invoice'],
                            'filename' => $filename
                        ]);
                    } catch (\Exception $fileError) {
                        Log::error('Failed to upload invoice:', ['error' => $fileError->getMessage()]);
                        // Don't fail the entire process if file upload fails
                    }
                }

            } else {
                $updateData['close_reason'] = $validated['close_reason'];
            }

            $leadDetail->update($updateData);

            // Update lead's status if needed
            $lead = Lead::find($leadId);
            if ($lead) {
                // Check if this was the last open vehicle
                $remainingOpenVehicles = LeadDetail::where('lead_id', $leadId)
                    ->where('status', 'Open')
                    ->count();

                if ($remainingOpenVehicles === 0) {
                    $lead->update(['status' => 'Closed']);
                }
            }

            DB::commit();

            // Reload with relationships
            $leadDetail->load(['brand', 'variant', 'color']);

            return response()->json([
                'success' => true,
                'message' => 'Vehicle converted successfully!',
                'data' => $leadDetail,
                'original_qty' => $originalQty ?? 0,
                'converted_qty' => $convertedQty ?? 0,
                'remaining_qty' => ($originalQty ?? 0) - ($convertedQty ?? 0),
                'has_invoice' => !empty($updateData['uploaded_invoice'] ?? '')
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
                'message' => 'Failed to convert vehicle: ' . $e->getMessage()
            ], 500);
        }
    }




    // public function closeEntireLead(Request $request, $leadId): JsonResponse
    // {
    //     Log::info('Close entire lead request:', [
    //         'lead_id' => $leadId,
    //         'request_data' => $request->all()
    //     ]);

    //     try {
    //         $validated = $request->validate([
    //             'close_type' => 'required|string|in:converted,Unrealized',
    //             'unrealized_reason' => 'required_if:close_type,Unrealized|string|nullable',
    //             'invoice_no' => 'required_if:close_type,converted|string|nullable',
    //             'uploaded_invoice' => 'nullable',
    //             'vehicles_data' => 'required_if:close_type,converted|json',
    //         ]);

    //         DB::beginTransaction();

    //         // Find the lead
    //         $lead = Lead::find($leadId);
    //         if (!$lead) {
    //             return response()->json([
    //                 'success' => false,
    //                 'message' => 'Lead not found'
    //             ], 404);
    //         }

    //         // Get all vehicles in this lead
    //         $vehicles = LeadDetail::where('lead_id', $leadId)->get();

    //         // Handle file upload for invoice copy
    //         $uploadedInvoicePath = null;
    //         if ($request->hasFile('uploaded_invoice')) {
    //             $uploadedInvoicePath = $request->file('uploaded_invoice')->store('invoices', 'public');
    //         }

    //         // Parse vehicles data
    //         $vehiclesData = json_decode($request->vehicles_data, true);

    //         $totalConvertedQty = 0;
    //         $totalOriginalQty = 0;

    //         // Update all vehicles
    //         foreach ($vehicles as $vehicle) {
    //             $updateData = [
    //                 'status' => $validated['close_type'],
    //             ];

    //             if ($validated['close_type'] === 'converted') {
    //                 $updateData['invoice_no'] = $validated['invoice_no'];

    //                 // Find vehicle data
    //                 $vehicleData = collect($vehiclesData)->firstWhere('vehicle_id', $vehicle->id);

    //                 if ($vehicleData) {
    //                     $originalQty = $vehicle->vehicle_qty;
    //                     $convertedQty = $vehicleData['vehicle_qty'] ?? $originalQty;

    //                     // Ensure converted quantity doesn't exceed original quantity
    //                     if ($convertedQty > $originalQty) {
    //                         throw new \Exception("Converted quantity cannot exceed original quantity for vehicle ID: {$vehicle->id}");
    //                     }

    //                     // Store converted quantity - original vehicle_qty remains unchanged
    //                     $updateData['converted_qty'] = $convertedQty;

    //                     $unitPrice = $vehicleData['unit_price'] ?? $vehicle->unit_price ?? $vehicle->variant->basic_price ?? 0;
    //                     $totalPrice = $unitPrice * $convertedQty;

    //                     $updateData['unit_price'] = $unitPrice;
    //                     $updateData['total_price'] = $totalPrice;

    //                     $totalConvertedQty += $convertedQty;
    //                     $totalOriginalQty += $originalQty;

    //                     // NO LONGER CREATE NEW ENTRY FOR REMAINING QUANTITY
    //                     // Just update the existing record with converted_qty

    //                     if ($uploadedInvoicePath) {
    //                         $updateData['uploaded_invoice'] = $uploadedInvoicePath;
    //                     }
    //                 }
    //             } else {
    //                 $updateData['close_reason'] = $validated['unrealized_reason'];
    //             }

    //             $vehicle->update($updateData);
    //         }

    //         // Update lead status
    //         $lead->update([
    //             'status' => $validated['close_type'] === 'converted' ? 'Closed' : 'Unrealized',
    //         ]);

    //         DB::commit();

    //         Log::info('Entire lead converted successfully:', [
    //             'lead_id' => $leadId,
    //             'close_type' => $validated['close_type'],
    //             'total_original_qty' => $totalOriginalQty,
    //             'total_converted_qty' => $totalConvertedQty,
    //             'remaining_qty' => $totalOriginalQty - $totalConvertedQty
    //         ]);

    //         return response()->json([
    //             'success' => true,
    //             'message' => 'Entire lead converted successfully',
    //             'data' => [
    //                 'lead' => $lead,
    //                 'total_original_quantity' => $totalOriginalQty,
    //                 'total_converted_quantity' => $totalConvertedQty,
    //                 'remaining_quantity' => $totalOriginalQty - $totalConvertedQty,
    //                 'is_partial_conversion' => $totalConvertedQty < $totalOriginalQty
    //             ]
    //         ], 200);

    //     } catch (\Illuminate\Validation\ValidationException $e) {
    //         DB::rollBack();
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Validation failed',
    //             'errors' => $e->errors()
    //         ], 422);
    //     } catch (\Exception $e) {
    //         DB::rollBack();
    //         Log::error('Failed to convert entire lead:', [
    //             'lead_id' => $leadId,
    //             'error' => $e->getMessage()
    //         ]);

    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Failed to convert entire lead: ' . $e->getMessage(),
    //         ], 500);
    //     }
    // }

    //invoice upload handled
    // public function closeEntireLead(Request $request, $leadId): JsonResponse
    // {
    //     Log::info('Close entire lead request - FULL REQUEST:', [
    //         'lead_id' => $leadId,
    //         'all_data' => $request->all(),
    //         'has_vehicles_data' => $request->has('vehicles_data'),
    //         'vehicles_data_value' => $request->input('vehicles_data'),
    //         'files' => $request->hasFile('uploaded_invoice') ? 'Yes' : 'No'
    //     ]);

    //     try {
    //         DB::beginTransaction();

    //         // Find the lead
    //         $lead = Lead::with('leadDetails')->find($leadId);
    //         if (!$lead) {
    //             return response()->json([
    //                 'success' => false,
    //                 'message' => 'Lead not found'
    //             ], 404);
    //         }

    //         // Get all vehicles in this lead
    //         $vehicles = $lead->leadDetails;

    //         // First, validate close_type
    //         $closeTypeValidator = Validator::make($request->all(), [
    //             'close_type' => 'required|string|in:converted,Unrealized'
    //         ]);

    //         if ($closeTypeValidator->fails()) {
    //             return response()->json([
    //                 'success' => false,
    //                 'message' => 'Validation failed',
    //                 'errors' => $closeTypeValidator->errors()
    //             ], 422);
    //         }

    //         $closeType = $request->close_type;
    //         if (strtolower($closeType) === 'unrealized') {
    //             $closeType = 'Unrealized';
    //         }

    //         // Now validate the rest based on close_type
    //         if ($closeType === 'converted') {
    //             $validator = Validator::make($request->all(), [
    //                 'invoice_no' => 'required|string',
    //                 'vehicles_data' => 'required',
    //                 'uploaded_invoice' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048'
    //             ]);
    //         } else {
    //             $validator = Validator::make($request->all(), [
    //                 'unrealized_reason' => 'required|string',
    //             ]);
    //         }

    //         if ($validator->fails()) {
    //             return response()->json([
    //                 'success' => false,
    //                 'message' => 'Validation failed',
    //                 'errors' => $validator->errors()
    //             ], 422);
    //         }

    //         // Handle file upload for invoice copy
    //         $uploadedInvoicePath = null;
    //         if ($request->hasFile('uploaded_invoice')) {
    //             try {
    //                 $file = $request->file('uploaded_invoice');
    //                 $filename = 'invoice_' . time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
    //                 $path = $file->storeAs('public/invoices', $filename);
    //                 $uploadedInvoicePath = 'invoices/' . $filename;

    //                 Log::info('Invoice uploaded successfully for entire lead:', [
    //                     'path' => $uploadedInvoicePath,
    //                     'filename' => $filename,
    //                     'lead_id' => $leadId
    //                 ]);
    //             } catch (\Exception $fileError) {
    //                 Log::error('Failed to upload invoice for entire lead:', ['error' => $fileError->getMessage()]);
    //             }
    //         }

    //         // Parse vehicles data (handle both JSON string and array)
    //         $vehiclesData = [];

    //         if ($closeType === 'converted') {
    //             $rawVehiclesData = $request->input('vehicles_data');

    //             Log::info('Processing vehicles_data:', [
    //                 'raw_type' => gettype($rawVehiclesData),
    //                 'raw_length' => is_string($rawVehiclesData) ? strlen($rawVehiclesData) : 'N/A',
    //                 'raw_first_100' => is_string($rawVehiclesData) ? substr($rawVehiclesData, 0, 100) : 'N/A',
    //                 'is_array' => is_array($rawVehiclesData)
    //             ]);

    //             // Handle different input formats
    //             if (is_array($rawVehiclesData)) {
    //                 // Already an array
    //                 $vehiclesData = $rawVehiclesData;
    //                 Log::info('vehicles_data is already an array', ['count' => count($vehiclesData)]);
    //             } elseif (is_string($rawVehiclesData) && !empty($rawVehiclesData)) {
    //                 // Try to decode as JSON
    //                 $vehiclesData = json_decode($rawVehiclesData, true);

    //                 if (json_last_error() !== JSON_ERROR_NONE) {
    //                     Log::error('JSON decode failed:', [
    //                         'error' => json_last_error_msg(),
    //                         'raw' => $rawVehiclesData
    //                     ]);

    //                     // Try alternative approach - might be a serialized PHP array
    //                     if (strpos($rawVehiclesData, 'a:') === 0) {
    //                         $vehiclesData = unserialize($rawVehiclesData);
    //                     }

    //                     if (!$vehiclesData) {
    //                         return response()->json([
    //                             'success' => false,
    //                             'message' => 'Invalid vehicles_data format',
    //                             'debug' => [
    //                                 'raw_type' => gettype($rawVehiclesData),
    //                                 'raw_sample' => substr($rawVehiclesData, 0, 200),
    //                                 'json_error' => json_last_error_msg()
    //                             ]
    //                         ], 422);
    //                     }
    //                 }
    //             } else {
    //                 return response()->json([
    //                     'success' => false,
    //                     'message' => 'vehicles_data is required and must be valid'
    //                 ], 422);
    //             }

    //             Log::info('Parsed vehicles_data:', [
    //                 'count' => count($vehiclesData),
    //                 'first_item' => $vehiclesData[0] ?? null
    //             ]);
    //         }

    //         $totalConvertedQty = 0;
    //         $totalOriginalQty = 0;

    //         // Update all vehicles
    //         foreach ($vehicles as $vehicle) {
    //             $updateData = [
    //                 'status' => $closeType,
    //             ];

    //             if ($closeType === 'converted') {
    //                 $updateData['invoice_no'] = $request->invoice_no;

    //                 // Find vehicle data
    //                 $vehicleData = null;
    //                 foreach ($vehiclesData as $vd) {
    //                     // Handle both string and integer IDs
    //                     if (
    //                         (int) $vd['vehicle_id'] === (int) $vehicle->id ||
    //                         $vd['vehicle_id'] == $vehicle->id
    //                     ) {
    //                         $vehicleData = $vd;
    //                         break;
    //                     }
    //                 }

    //                 if ($vehicleData) {
    //                     $originalQty = $vehicle->vehicle_qty;
    //                     $convertedQty = $vehicleData['vehicle_qty'] ?? $originalQty;

    //                     // Ensure converted quantity doesn't exceed original quantity
    //                     if ($convertedQty > $originalQty) {
    //                         throw new \Exception("Converted quantity cannot exceed original quantity for vehicle ID: {$vehicle->id}");
    //                     }

    //                     // Store converted quantity
    //                     $updateData['converted_qty'] = $convertedQty;

    //                     $unitPrice = $vehicleData['unit_price'] ?? $vehicle->unit_price ?? 0;
    //                     $totalPrice = $unitPrice * $convertedQty;

    //                     $updateData['unit_price'] = $unitPrice;
    //                     $updateData['total_price'] = $totalPrice;

    //                     $totalConvertedQty += $convertedQty;
    //                     $totalOriginalQty += $originalQty;

    //                     // Store the uploaded invoice path for all vehicles
    //                     if ($uploadedInvoicePath) {
    //                         $updateData['uploaded_invoice'] = $uploadedInvoicePath;
    //                     }
    //                 }
    //             } else {
    //                 $updateData['close_reason'] = $request->unrealized_reason;
    //             }

    //             $vehicle->update($updateData);
    //         }

    //         // Update lead status
    //         $lead->update([
    //             'status' => $closeType === 'converted' ? 'Closed' : 'Unrealized',
    //         ]);

    //         DB::commit();

    //         Log::info('Entire lead converted successfully:', [
    //             'lead_id' => $leadId,
    //             'close_type' => $closeType,
    //             'total_original_qty' => $totalOriginalQty,
    //             'total_converted_qty' => $totalConvertedQty,
    //             'has_invoice' => !empty($uploadedInvoicePath)
    //         ]);

    //         return response()->json([
    //             'success' => true,
    //             'message' => 'Entire lead converted successfully',
    //             'data' => [
    //                 'lead' => $lead,
    //                 'total_original_quantity' => $totalOriginalQty,
    //                 'total_converted_quantity' => $totalConvertedQty,
    //                 'remaining_quantity' => $totalOriginalQty - $totalConvertedQty,
    //                 'is_partial_conversion' => $totalConvertedQty < $totalOriginalQty,
    //                 'has_invoice' => !empty($uploadedInvoicePath)
    //             ]
    //         ], 200);

    //     } catch (\Exception $e) {
    //         DB::rollBack();
    //         Log::error('Failed to convert entire lead:', [
    //             'lead_id' => $leadId,
    //             'error' => $e->getMessage(),
    //             'trace' => $e->getTraceAsString()
    //         ]);

    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Failed to convert entire lead: ' . $e->getMessage(),
    //         ], 500);
    //     }
    // }

    public function closeEntireLead(Request $request, $leadId): JsonResponse
{
    // Debug: Log all incoming data
    Log::info('=== CLOSE ENTIRE LEAD REQUEST START ===');
    Log::info('Lead ID:', ['id' => $leadId]);
    Log::info('All request data:', $request->all());
    Log::info('Has uploaded_invoice file:', ['has' => $request->hasFile('uploaded_invoice')]);
    Log::info('vehicles_data present:', ['has' => $request->has('vehicles_data')]);

    try {
        DB::beginTransaction();

        $lead = Lead::with('leadDetails')->find($leadId);
        if (!$lead) {
            return response()->json([
                'success' => false,
                'message' => 'Lead not found'
            ], 404);
        }

        $vehicles = $lead->leadDetails;

        // Validate close_type
        $closeTypeValidator = Validator::make($request->all(), [
            'close_type' => 'required|string|in:converted,Unrealized'
        ]);

        if ($closeTypeValidator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $closeTypeValidator->errors()
            ], 422);
        }

        $closeType = $request->close_type;
        if (strtolower($closeType) === 'unrealized') {
            $closeType = 'Unrealized';
        }

        // Validate based on close_type
        if ($closeType === 'converted') {
            $validator = Validator::make($request->all(), [
                'invoice_no' => 'required|string',
                'vehicles_data' => 'required',
                'uploaded_invoice' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048'
            ]);
        } else {
            $validator = Validator::make($request->all(), [
                'unrealized_reason' => 'required|string',
            ]);
        }

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Handle file upload for invoice copy - CRITICAL FIX
        $uploadedInvoicePath = null;
        if ($request->hasFile('uploaded_invoice')) {
            try {
                $file = $request->file('uploaded_invoice');
                Log::info('Processing invoice file:', [
                    'name' => $file->getClientOriginalName(),
                    'size' => $file->getSize(),
                    'type' => $file->getMimeType()
                ]);

                // Generate unique filename
                $filename = 'invoice_' . time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();

                // Store in public/invoices directory
                $path = $file->storeAs('public/invoices', $filename);

                // Log storage path
                Log::info('File stored at:', ['path' => $path]);

                // Save the path in database (without 'public/' prefix for web access)
                $uploadedInvoicePath = 'invoices/' . $filename;

                Log::info('Invoice uploaded successfully:', [
                    'path' => $uploadedInvoicePath,
                    'filename' => $filename,
                    'lead_id' => $leadId
                ]);
            } catch (\Exception $fileError) {
                Log::error('Failed to upload invoice:', [
                    'error' => $fileError->getMessage(),
                    'trace' => $fileError->getTraceAsString()
                ]);
                // Continue without file if upload fails
            }
        } else {
            Log::info('No invoice file uploaded or file upload failed');
        }

        // Parse vehicles data
        $vehiclesData = [];
        $totalConvertedQty = 0;
        $totalOriginalQty = 0;

        if ($closeType === 'converted') {
            $rawVehiclesData = $request->input('vehicles_data');

            Log::info('Raw vehicles_data:', [
                'type' => gettype($rawVehiclesData),
                'length' => is_string($rawVehiclesData) ? strlen($rawVehiclesData) : 'N/A',
                'sample' => is_string($rawVehiclesData) ? substr($rawVehiclesData, 0, 200) : 'N/A'
            ]);

            if (is_array($rawVehiclesData)) {
                $vehiclesData = $rawVehiclesData;
                Log::info('vehicles_data is already an array');
            } elseif (is_string($rawVehiclesData) && !empty($rawVehiclesData)) {
                $vehiclesData = json_decode($rawVehiclesData, true);

                if (json_last_error() !== JSON_ERROR_NONE) {
                    Log::error('JSON decode error:', [
                        'error' => json_last_error_msg(),
                        'raw' => $rawVehiclesData
                    ]);

                    // Try to clean the JSON string
                    $cleaned = trim($rawVehiclesData, '"');
                    $cleaned = stripslashes($cleaned);
                    $vehiclesData = json_decode($cleaned, true);

                    if (json_last_error() !== JSON_ERROR_NONE) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Invalid JSON in vehicles_data: ' . json_last_error_msg()
                        ], 422);
                    }
                }
            }

            Log::info('Parsed vehicles_data:', [
                'count' => count($vehiclesData),
                'data' => $vehiclesData
            ]);

            // Update all vehicles
            foreach ($vehicles as $vehicle) {
                $updateData = [
                    'status' => $closeType,
                    'invoice_no' => $request->invoice_no,
                ];

                // Find vehicle data
                $vehicleData = null;
                foreach ($vehiclesData as $vd) {
                    // Compare vehicle IDs (handle both string and integer)
                    if ((int)$vd['vehicle_id'] === (int)$vehicle->id) {
                        $vehicleData = $vd;
                        break;
                    }
                }

                if ($vehicleData) {
                    $originalQty = $vehicle->vehicle_qty;
                    $convertedQty = $vehicleData['vehicle_qty'] ?? $originalQty;

                    if ($convertedQty > $originalQty) {
                        throw new \Exception("Converted quantity cannot exceed original quantity for vehicle ID: {$vehicle->id}");
                    }

                    $updateData['converted_qty'] = $convertedQty;

                    $unitPrice = $vehicleData['unit_price'] ?? $vehicle->unit_price ?? 0;
                    $totalPrice = $unitPrice * $convertedQty;

                    $updateData['unit_price'] = $unitPrice;
                    $updateData['total_price'] = $totalPrice;

                    $totalConvertedQty += $convertedQty;
                    $totalOriginalQty += $originalQty;

                    // Store uploaded invoice path if available
                    if ($uploadedInvoicePath) {
                        $updateData['uploaded_invoice'] = $uploadedInvoicePath;
                        Log::info('Assigning invoice path to vehicle:', [
                            'vehicle_id' => $vehicle->id,
                            'invoice_path' => $uploadedInvoicePath
                        ]);
                    }
                }

                $vehicle->update($updateData);
                Log::info('Updated vehicle:', [
                    'id' => $vehicle->id,
                    'data' => $updateData
                ]);
            }
        } else {
            // Handle Unrealized leads
            foreach ($vehicles as $vehicle) {
                $updateData = [
                    'status' => $closeType,
                    'close_reason' => $request->unrealized_reason,
                ];
                $vehicle->update($updateData);
            }
        }

        // Update lead status
        $lead->update([
            'status' => $closeType === 'converted' ? 'Closed' : 'Unrealized',
        ]);

        DB::commit();

        Log::info('Entire lead processed successfully:', [
            'lead_id' => $leadId,
            'close_type' => $closeType,
            'total_original_qty' => $totalOriginalQty,
            'total_converted_qty' => $totalConvertedQty,
            'has_invoice' => !empty($uploadedInvoicePath),
            'invoice_path' => $uploadedInvoicePath
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Entire lead converted successfully',
            'data' => [
                'lead' => $lead,
                'total_original_quantity' => $totalOriginalQty,
                'total_converted_quantity' => $totalConvertedQty,
                'remaining_quantity' => $totalOriginalQty - $totalConvertedQty,
                'is_partial_conversion' => $totalConvertedQty < $totalOriginalQty,
                'has_invoice' => !empty($uploadedInvoicePath),
                'invoice_path' => $uploadedInvoicePath
            ]
        ], 200);

    } catch (\Exception $e) {
        DB::rollBack();
        Log::error('Failed to convert entire lead:', [
            'lead_id' => $leadId,
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);

        return response()->json([
            'success' => false,
            'message' => 'Failed to convert entire lead: ' . $e->getMessage(),
        ], 500);
    }
}
    public function getInvoiceFile($filename)
    {
        $path = storage_path('app/public/invoices/' . $filename);

        if (!file_exists($path)) {
            return response()->json([
                'success' => false,
                'message' => 'Invoice file not found'
            ], 404);
        }

        return response()->file($path);
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


    // public function getConvertedLeads(): JsonResponse
    // {
    //     try {
    //         $leadDetails = LeadDetail::with([
    //             'lead',
    //             'brand',
    //             'variant',
    //             'color',
    //             'variant.colorPrices'
    //         ])
    //             ->where('status', 'converted')
    //             ->whereNotNull('invoice_no')
    //             ->orderBy('updated_at', 'desc')
    //             ->get();

    //         // Group by lead_id for better organization
    //         $groupedLeads = [];

    //         foreach ($leadDetails as $detail) {
    //             $leadId = $detail->lead_id;
    //             $lead = $detail->lead;

    //             if (!isset($groupedLeads[$leadId])) {
    //                 $groupedLeads[$leadId] = [
    //                     'id' => $leadId,
    //                     'customer_name' => $lead ? $lead->customer_name : 'N/A',
    //                     'phone_no' => $lead ? $lead->phone_no : 'N/A',
    //                     'location' => $lead ? $lead->location : 'N/A',
    //                     'payment_mode' => $lead ? $lead->payment_mode : null,
    //                     'status' => $lead ? $lead->status : null,
    //                     'created_at' => $lead ? $lead->created_at : null,
    //                     'updated_at' => $lead ? $lead->updated_at : null,
    //                     'lead_details' => []
    //                 ];
    //             }

    //             // Get vehicle price
    //             $vehiclePrice = null;
    //             if ($detail->color_id && $detail->variant) {
    //                 $colorPriceObj = $detail->variant->colorPrices
    //                     ->where('color_id', $detail->color_id)
    //                     ->first();
    //                 $vehiclePrice = $colorPriceObj ? $colorPriceObj->price : null;
    //             }

    //             // Add vehicle detail
    //             $groupedLeads[$leadId]['lead_details'][] = [
    //                 'id' => $detail->id,
    //                 'lead_id' => $detail->lead_id,
    //                 'brand_id' => $detail->brand_id,
    //                 'variant_id' => $detail->variant_id,
    //                 'color_id' => $detail->color_id,
    //                 'vehicle_qty' => $detail->vehicle_qty,
    //                 'qty' => $detail->vehicle_qty, // For compatibility
    //                 'status' => $detail->status,
    //                 'close_reason' => $detail->close_reason,
    //                 'invoice_no' => $detail->invoice_no,
    //                 'uploaded_invoice' => $detail->uploaded_invoice,
    //                 'unit_price' => $detail->unit_price,
    //                 'total_price' => $detail->total_price,
    //                 'created_at' => $detail->created_at,
    //                 'updated_at' => $detail->updated_at,
    //                 'brand_name' => $detail->brand ? $detail->brand->name : null,
    //                 'variant_name' => $detail->variant ? $detail->variant->name : null,
    //                 'color_name' => $detail->color ? ($detail->color->color_name ?? $detail->color->name) : null,
    //                 'color_code' => $detail->color ? $detail->color->color_code : null,
    //                 'color_price' => $vehiclePrice,
    //                 'brand' => $detail->brand ? [
    //                     'id' => $detail->brand->id,
    //                     'name' => $detail->brand->name
    //                 ] : null,
    //                 'variant' => $detail->variant ? [
    //                     'id' => $detail->variant->id,
    //                     'name' => $detail->variant->name,
    //                     'basic_price' => $detail->variant->basic_price
    //                 ] : null,
    //                 'color' => $detail->color ? [
    //                     'id' => $detail->color->id,
    //                     'name' => $detail->color->name,
    //                     'color_name' => $detail->color->color_name,
    //                     'color_code' => $detail->color->color_code
    //                 ] : null
    //             ];
    //         }

    //         // Convert to array and reset keys
    //         $leads = array_values($groupedLeads);

    //         return response()->json([
    //             'success' => true,
    //             'data' => $leads,
    //             'message' => 'Converted leads retrieved successfully.',
    //             'count' => count($leads)
    //         ]);
    //     } catch (\Exception $e) {
    //         Log::error('Failed to fetch converted leads:', ['error' => $e->getMessage()]);
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Failed to fetch converted leads: ' . $e->getMessage()
    //         ], 500);
    //     }
    // }

    public function getConvertedLeads(): JsonResponse
    {
        try {
            $leadDetails = LeadDetail::with([
                'lead',
                'brand',
                'variant',
                'color',
                'variant.colorPrices'
            ])
                ->where('status', 'converted')
                ->whereNotNull('invoice_no')
                ->orderBy('updated_at', 'desc')
                ->get();

            // Group by lead_id for better organization
            $groupedLeads = [];

            foreach ($leadDetails as $detail) {
                $leadId = $detail->lead_id;
                $lead = $detail->lead;

                if (!isset($groupedLeads[$leadId])) {
                    $groupedLeads[$leadId] = [
                        'id' => $leadId,
                        'customer_name' => $lead ? $lead->customer_name : 'N/A',
                        'phone_no' => $lead ? $lead->phone_no : 'N/A',
                        'location' => $lead ? $lead->location : 'N/A',
                        'payment_mode' => $lead ? $lead->payment_mode : null,
                        'status' => $lead ? $lead->status : null,
                        'created_at' => $lead ? $lead->created_at : null,
                        'updated_at' => $lead ? $lead->updated_at : null,
                        'lead_details' => []
                    ];
                }

                // Add vehicle detail with converted_qty
                $groupedLeads[$leadId]['lead_details'][] = [
                    'id' => $detail->id,
                    'lead_id' => $detail->lead_id,
                    'brand_id' => $detail->brand_id,
                    'variant_id' => $detail->variant_id,
                    'color_id' => $detail->color_id,
                    'vehicle_qty' => $detail->vehicle_qty, // Original quantity
                    'converted_qty' => $detail->converted_qty, // Converted quantity
                    'remaining_qty' => $detail->vehicle_qty - $detail->converted_qty, // Calculated remaining
                    'status' => $detail->status,
                    'close_reason' => $detail->close_reason,
                    'invoice_no' => $detail->invoice_no,
                    'uploaded_invoice' => $detail->uploaded_invoice,
                    'unit_price' => $detail->unit_price,
                    'total_price' => $detail->total_price,
                    'created_at' => $detail->created_at,
                    'updated_at' => $detail->updated_at,
                    // ... other fields
                ];
            }

            $leads = array_values($groupedLeads);

            return response()->json([
                'success' => true,
                'data' => $leads,
                'message' => 'Converted leads retrieved successfully.',
                'count' => count($leads)
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch converted leads:', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch converted leads: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all Unrealized leads with details
     */
    public function getUnrealizedLeads(): JsonResponse
    {
        try {
            $leadDetails = LeadDetail::with([
                'lead',
                'brand',
                'variant',
                'color'
            ])
                ->where('status', 'Unrealized')
                ->orderBy('updated_at', 'desc')
                ->get();

            // Format the response
            $formattedLeads = $leadDetails->map(function ($detail) {
                $lead = $detail->lead;

                return [
                    'id' => $detail->id,
                    'lead_id' => $detail->lead_id,
                    'customer_name' => $lead ? $lead->customer_name : 'N/A',
                    'phone_no' => $lead ? $lead->phone_no : 'N/A',
                    'location' => $lead ? $lead->location : 'N/A',
                    'address' => $lead ? $lead->address : null,
                    'tentative_purchase_date' => $lead ? $lead->tentative_purchase_date : null,
                    'vehicle_qty' => $detail->vehicle_qty,
                    'payment_mode' => $lead ? $lead->payment_mode : null,
                    'status' => $detail->status,
                    'close_reason' => $detail->close_reason, // ✅ ADD THIS - Get close_reason from lead_details
                    'invoice_no' => $detail->invoice_no,
                    'uploaded_invoice' => $detail->uploaded_invoice,
                    'created_at' => $detail->created_at,
                    'updated_at' => $detail->updated_at,
                    'lost_date' => $detail->updated_at, // Use updated_at as lost date
                    'lead_details' => [
                        [
                            'id' => $detail->id,
                            'lead_id' => $detail->lead_id,
                            'brand_id' => $detail->brand_id,
                            'variant_id' => $detail->variant_id,
                            'color_id' => $detail->color_id,
                            'vehicle_qty' => $detail->vehicle_qty,
                            'status' => $detail->status,
                            'close_reason' => $detail->close_reason, // ✅ ADD THIS
                            'invoice_no' => $detail->invoice_no,
                            'uploaded_invoice' => $detail->uploaded_invoice,
                            'created_at' => $detail->created_at,
                            'updated_at' => $detail->updated_at,
                            'brand_name' => $detail->brand ? $detail->brand->name : null,
                            'variant_name' => $detail->variant ? $detail->variant->name : null,
                            'color_name' => $detail->color ? ($detail->color->color_name ?? $detail->color->name) : null,
                            'color_code' => $detail->color ? $detail->color->color_code : null,
                        ]
                    ]
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $formattedLeads,
                'message' => 'Unrealized leads retrieved successfully.',
                'count' => $formattedLeads->count()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve Unrealized leads: ' . $e->getMessage(),
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


    public function getColorsWithPrices(Variant $variant): JsonResponse
    {
        try {
            $colorsWithPrices = $variant->getColorsWithPrices();
            return response()->json([
                'success' => true,
                'data' => $colorsWithPrices,
                'message' => 'Colors with prices retrieved successfully.'

            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve colors with prices.',
                'error' => $e->getMessage()
            ], 500);

        }
    }




    public function getDealerMappingForArea(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'area_id' => 'required|integer',
                'city_id' => 'required|integer',
            ]);

            $areaId = $request->area_id;
            $cityId = $request->city_id;

            // Find dealer mapped to this area
            $dealerAreaMap = DB::table('dealer_area_map')
                ->where('city_id', $cityId)
                ->where('area_id', 'LIKE', "%{$areaId}%")
                ->first();

            if ($dealerAreaMap) {
                $dealerId = $dealerAreaMap->user_id;

                // Find distributor for this dealer
                $distributorMap = DB::table('distributor_dealer_map')
                    ->where('dealer_id', $dealerId)
                    ->first();

                return response()->json([
                    'success' => true,
                    'dealer_id' => $dealerId,
                    'distributor_id' => $distributorMap ? $distributorMap->user_id : null,
                    'message' => 'Dealer and distributor mapping found'
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'No dealer mapped for this area'
            ], 404);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching dealer mapping: ' . $e->getMessage()
            ], 500);
        }
    }
}
