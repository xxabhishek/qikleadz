<?php

// use App\Http\Controllers\Admin\Api\PaymentModeApiController;
use App\Http\Controllers\Admin\DealerAreaMapController;
use App\Http\Controllers\API\Admin\AuthApiController;
use App\Http\Controllers\API\Admin\CCApiController;
use App\Http\Controllers\API\Admin\ColorApiController;
use App\Http\Controllers\API\Admin\FeatureApiController;
use App\Http\Controllers\API\Admin\GalleryApiController;
use App\Http\Controllers\API\Admin\LeadApiController;
use App\Http\Controllers\API\Admin\OemApiController;
use App\Http\Controllers\API\Admin\TechSpecApiController;
use App\Http\Controllers\API\Admin\TransmissionApiController;
use App\Http\Controllers\API\Admin\VariantApiController;
use App\Http\Controllers\API\Admin\VehicleSegmentApiController;
use App\Http\Controllers\API\Admin\VehicleUsageApiController;
use App\Http\Controllers\API\Admin\AreaApiController;
use App\Http\Controllers\API\Admin\PaymentModeApiController;
use App\Http\Controllers\API\DealerMappingController;
use App\Http\Controllers\Api\TestController;
use App\Http\Controllers\ExecutiveController;
use App\Models\Brand;
use App\Models\Gallery;
use App\Models\Variant;
use Faker\Guesser\Name;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;


Route::post('/login', [\App\Http\Controllers\Api\Admin\AuthApiController::class, 'apiLogin']);

Route::post('/forgot-password', [AuthApiController::class, 'sendResetLink'])->name('password.reset');


Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user/profile', [AuthApiController::class, 'profile'])
        ->withoutMiddleware('throttle:api');

    Route::post('/user/change-pin', [AuthApiController::class, 'changePin'])
        ->withoutMiddleware('throttle:api');
});



Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});


Route::apiResource('galleries', GalleryApiController::class);
Route::apiResource('vehicle-usages', VehicleUsageApiController::class);
Route::apiResource('vehicle-segments', VehicleSegmentApiController::class);
Route::apiResource('transmission', TransmissionApiController::class);
Route::apiResource('brands', App\Http\Controllers\API\Admin\BrandApiController::class);
Route::apiResource('variants', VariantApiController::class);
Route::apiResource('fuel-types', \App\Http\Controllers\API\Admin\FuelTypeApiController::class);
Route::apiResource('ccs', CCApiController::class);
Route::apiResource('features', FeatureApiController::class);
Route::apiResource('colors', ColorApiController::class);
Route::apiResource('tech-specs', TechSpecApiController::class);
Route::apiResource('oems', OemApiController::class);

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('leads', LeadApiController::class);
    Route::get('/lead-details/draft', [LeadApiController::class, 'draft']);
    Route::get('/lead-details/open', [LeadApiController::class, 'openCount']);
    Route::get('/lead-details/converted', [LeadApiController::class, 'converted']);
    Route::get('/lead-details/unrealized', [LeadApiController::class, 'unrealized']);
    Route::get('/lead-details/converted-today', [LeadApiController::class, 'convertedToday']);
});
Route::middleware('auth:sanctum')->get('/claims/earnings-summary', [LeadApiController::class, 'earningsSummary']);
Route::middleware('auth:sanctum')->get('/claims/recent-earnings', [LeadApiController::class, 'recentEarnings']);

Route::post('leads/{lead}/vehicles', [LeadApiController::class, 'addVehicle']);
Route::post('/leads/submit-all', [LeadApiController::class, 'submitAll']);
Route::get('/lead-data', [LeadApiController::class, 'getLeadData']);
Route::get('/leads/latest', [LeadApiController::class, 'latest']);


Route::get('/debug-draft', [LeadApiController::class, 'debugDraft']);
Route::get('/vehicle-filter', [LeadApiController::class, 'vehicleFilterData']);
Route::put('/leads/{id}/update', [LeadApiController::class, 'update']);
Route::put('/leads/{lead}/update', [LeadApiController::class, 'updateLeadWithVehicles']);
Route::delete('/leads/{leadId}/complete', [LeadApiController::class, 'destroyCompleteLead']);

Route::delete('/lead-details/{id}', [LeadApiController::class, 'destroy']);
// Route::put('/leads/{lead}/submit-draft', [LeadApiController::class, 'submitDraft']);
Route::put('/leads/{lead}/submit-draft', [LeadApiController::class, 'submitDraftLead']);
// Route::put('leads/{leadId}/submit-draft', [LeadApiController::class, 'submitDraftLead']);

Route::get('/leads/{leadId}/debug-vehicles', [LeadApiController::class, 'debugLeadVehicles']);

Route::put('/leads/{lead}/status', [LeadApiController::class, 'updateStatus']);
// Route::post('/leads/{lead}/vehicles', [LeadApiController::class, 'addVehicle']);
Route::post('/leads/{leadId}/vehicles', [LeadApiController::class, 'addVehicle']);

// Route::put('/lead-details/{leadDetail}', [LeadApiController::class, 'updateVehicle']);
Route::put('/lead-details/{leadDetailId}', [LeadApiController::class, 'updateVehicle']);
Route::get('/leads-by-status', [LeadApiController::class, 'getLeadsByStatus']);
Route::delete('leads/{leadId}/vehicles/{vehicleId}', [LeadApiController::class, 'deleteVehicle']);
Route::delete('leads/{leadId}/vehicles/{vehicleId}', [LeadApiController::class, 'removeVehicle']);

// Lead closing routes
Route::put('leads/{lead}/status', [LeadApiController::class, 'updateLeadStatus']);
Route::put('/leads/{id}/update-status', [LeadApiController::class, 'updateStatus']);
// Route::put('lead-details/{leadDetail}/close', [LeadApiController::class, 'closeVehicle']);
// Route::put('leads/{lead}/close-entire', [LeadApiController::class, 'closeEntireLead']);

Route::put('/lead-details/{leadDetailId}/close', [LeadApiController::class, 'closeVehicle']);
Route::put('/leads/{leadId}/close-entire', [LeadApiController::class, 'closeEntireLead']);
Route::get('leads/{lead}/details', [LeadApiController::class, 'getLeadWithDetails']);
Route::post('leads/bulk-close-vehicles', [LeadApiController::class, 'bulkCloseVehicles']);
Route::put(
    '/leads/{leadId}/close-entire-with-files',
    [LeadApiController::class, 'closeEntireLeadWithFiles']
);
// Route::post('/lead-details/{leadDetail}/close', [LeadApiController::class, 'closeIndividualVehicle']);

// Route::post('/lead-details', [LeadDetailController::class, 'store'])->name('lead-details.store');
Route::post('/lead-details', [LeadApiController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('claims/total', [LeadApiController::class, 'getTotalClaimsCount']);
    Route::get('claims/successful', [LeadApiController::class, 'getSuccessfulClaimsCount']);
    Route::get('claims/disputed', [LeadApiController::class, 'getDisputedClaimsCount']);
    Route::get('claims/rejected', [LeadApiController::class, 'getRejectedClaimsCount']);
    Route::get('claims/all-counts', [LeadApiController::class, 'getAllClaimsCounts']);
});

Route::middleware('auth:sanctum')->get('/lead-details/claims', [LeadApiController::class, 'getExecutiveClaims']);
Route::middleware('auth:sanctum')->get('/credit-notes', [LeadApiController::class, 'getCreditNotes']);

Route::prefix('admin')->group(function () {
    Route::apiResource('areas', AreaApiController::class)->names('api.admin.areas');
    Route::get('/states-by-country/{countryId}', [AreaApiController::class, 'getStatesByCountry'])->name('api.admin.states.by.country');
    Route::get('/cities-by-state/{stateId}', [AreaApiController::class, 'getCitiesByState'])->name('api.admin.cities.by.state');
    Route::get('/cities', [AreaApiController::class, 'getCities'])->name('api.admin.cities');
});
// routes/api.php
Route::get('dealer-area-map/city/{cityId}', [DealerAreaMapController::class, 'areasByCity']);
Route::get('/dealer-areas', [DealerAreaMapController::class, 'getDealerAreas']);
Route::get('admin/get-galleries', [GalleryApiController::class, 'getGalleries']);


Route::get('converted-leads', [LeadApiController::class, 'getConvertedLeads']);
Route::get('/variants/{variant}/colors-with-prices', [LeadApiController::class, 'getColorsWithPrices']);
Route::get('unrealized-leads', [LeadApiController::class, 'getUnrealizedLeads']);


Route::post('/leads/{leadId}/add-vehicle', [LeadApiController::class, 'addVehicleToLead']);
Route::group(['prefix' => 'dealer'], function () {
    Route::get('/distributor-mapping', [\App\Http\Controllers\API\Admin\DealerMappingController::class, 'getDealerDistributorMapping']);
    Route::get('/area-mapping', [\App\Http\Controllers\API\Admin\DealerMappingController::class, 'getDealerForArea']);
});



// Route::group(['middleware' => 'auth:api'], function () {
// Location and Area routes
Route::get('/locations/search', [AreaApiController::class, 'searchLocations']);
Route::get('/areas/by-city/{cityId}', [AreaApiController::class, 'getAreasByCity']);
Route::get('/areas/dealer-areas/{cityId}', [AreaApiController::class, 'getDealerAreasByCity']);

Route::apiResource('payment-modes', \App\Http\Controllers\Api\Admin\PaymentModeApiController::class);

Route::get('invoices/{filename}', [LeadApiController::class, 'getInvoiceFile'])
    ->middleware('auth:api');

Route::put('/leads/{lead}/update-follow-up', [LeadApiController::class, 'updateFollowUpDate']);
Route::get('/leads/{lead}/follow-up-history', [LeadApiController::class, 'getFollowUpHistory']);


Route::get(
    '/test-lead/{leadId}',
    [App\Http\Controllers\API\Admin\LeadApiController::class, 'testEndpoint']
);

Route::get('/debug-file-upload', [LeadApiController::class, 'debugFileUpload']);
Route::get('/test-formdata', function (Request $request) {
    \Log::info('=== TEST ENDPOINT HIT ===');
    \Log::info('Content-Type:', [$request->header('Content-Type')]);
    \Log::info('All input keys:', array_keys($request->all()));
    \Log::info('All input values:', $request->all());
    \Log::info('Has vehicles_data?:', [$request->has('vehicles_data')]);
    \Log::info('vehicles_data value:', [$request->input('vehicles_data')]);

    // Check raw body
    $raw = file_get_contents('php://input');
    \Log::info('Raw body (first 1000 chars):', [substr($raw, 0, 1000)]);

    return response()->json([
        'success' => true,
        'debug' => [
            'input_keys' => array_keys($request->all()),
            'vehicles_data_exists' => $request->has('vehicles_data'),
            'vehicles_data_value' => $request->input('vehicles_data'),
            'vehicles_data_type' => gettype($request->input('vehicles_data')),
            'all_input' => $request->all(),
        ]
    ]);
});


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/executive/notifications', [ExecutiveController::class, 'getNotifications']);
    Route::post('/executive/notifications/mark-read', [ExecutiveController::class, 'markNotificationsRead']);
    Route::post('/executive/notifications/mark-all-read', [ExecutiveController::class, 'markAllRead']);
});



Route::get('/lead-details', [LeadApiController::class, 'getLeadDetailsByLeadNo']);
Route::get('/lead-details/by-lead-no', [LeadApiController::class, 'getLeadDetailsByLeadNo']);
Route::get('/lead-details/lead/{leadId}/generateinvoice', [LeadApiController::class, 'generateInvoice']);


Route::get('/debug-counts', function () {
    return [
        'draft' => \App\Models\LeadDetail::where('status', 'Draft')->count(),
        'open' => \App\Models\LeadDetail::where('status', 'Open')->count(),
        'converted' => \App\Models\LeadDetail::where('status', 'converted')->count(),
        'unrealized' => \App\Models\LeadDetail::where('status', 'Unrealized')->count(),
    ];
});
Route::get('/me', function () {
    return auth()->user() ? auth()->id() : 'Guest';
});

Route::middleware('auth:sanctum')->get('/user/allowed-brands', function (Request $request) {
    $user = $request->user();

    // Agar user ka country_id null hai toh fallback (optional)
    if (!$user->country_id) {
        return response()->json([
            'success' => false,
            'message' => 'User country not set'
        ], 400);
    }

    // Sirf usi country ke brands fetch karo
    $brands = Brand::select('id', 'name')
        ->where('country_id', $user->country_id)
        ->orderBy('name')
        ->get();

    return response()->json([
        'success' => true,
        'data' => $brands
    ]);
});

Route::middleware('auth:sanctum')->get('/user/country-brands', function (Request $request) {
    $user = $request->user();

    if (!$user->country_id) {
        return response()->json(['success' => false, 'message' => 'Country not set'], 400);
    }

    $brands = Brand::select('id', 'name')
        ->where('country_id', $user->country_id)
        ->orderBy('name')
        ->get();

    return response()->json(['success' => true, 'data' => $brands]);
});

// User ke country ke variants + related data
Route::middleware('auth:sanctum')->get('/user/country-variants', function (Request $request) {
    $user = $request->user();

    if (!$user->country_id) {
        return response()->json(['success' => false, 'message' => 'Country not set'], 400);
    }

    $variants = Variant::whereHas('brand', function ($q) use ($user) {
        $q->where('country_id', $user->country_id);
    })
        ->select(
            'id',
            'name',
            'brand_id',
            'fuel_type_id',
            'cc_id',
            'basic_price'
        )
        ->get();

    return response()->json(['success' => true, 'data' => $variants]);
});

// Galleries bhi country filter ke saath
Route::middleware('auth:sanctum')->get('/user/country-galleries', function (Request $request) {
    $user = $request->user();

    if (!$user->country_id) {
        return response()->json(['success' => false, 'message' => 'Country not set'], 400);
    }

    $galleries = Gallery::whereHas('brand', function ($q) use ($user) {
        $q->where('country_id', $user->country_id);
    })->get();

    return response()->json(['success' => true, 'data' => $galleries]);
});
