<?php

use App\Http\Controllers\Admin\DealerAreaMapController;
use App\Http\Controllers\Api\Admin\AuthApiController;
use App\Http\Controllers\API\Admin\CCApiController;
use App\Http\Controllers\API\Admin\ColorApiController;
use App\Http\Controllers\API\Admin\FeatureApiController;
use App\Http\Controllers\API\Admin\GalleryApiController;
use App\Http\Controllers\API\Admin\LeadApiController;
use App\Http\Controllers\Api\Admin\OemApiController;
use App\Http\Controllers\API\Admin\TechSpecApiController;
use App\Http\Controllers\Api\Admin\TransmissionApiController;
use App\Http\Controllers\API\Admin\VariantApiController;
use App\Http\Controllers\API\Admin\VehicleSegmentApiController;
use App\Http\Controllers\API\Admin\VehicleUsageApiController;
use App\Http\Controllers\API\Admin\AreaApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/login', [AuthApiController::class, 'apiLogin']);

Route::post('/forgot-password', [AuthApiController::class, 'sendResetLink']);
Route::post('/reset-password', [AuthApiController::class, 'resetPassword']);


Route::get('/mail-test', function () {
    try {
        Mail::raw("Testing Gmail SMTP from Laravel", function ($m) {
            $m->to("abhishekadatrao60@gmail.com")
                ->subject("SMTP Test");
        });

        return "Mail Sent!";
    } catch (\Exception $e) {
        return $e->getMessage();
    }
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

Route::apiResource('leads', LeadApiController::class);
Route::post('leads/{lead}/vehicles', [LeadApiController::class, 'addVehicle']);
Route::post('/leads/submit-all', [LeadApiController::class, 'submitAll']);
// Route::get('/leads/draft', [LeadApiController::class, 'draftLeads']);
Route::get('/lead-data', [LeadApiController::class, 'getLeadData']);
Route::get('/leads/latest', [LeadApiController::class, 'latest']);
// routes/api.php
Route::get('/lead-details/draft', [LeadApiController::class, 'draft']);
Route::get('/debug-draft', [LeadApiController::class, 'debugDraft']);
Route::get('/vehicle-filter', [LeadApiController::class, 'vehicleFilterData']);
// Route::put('lead-details/{id}', [LeadApiController::class, 'update']);
// Route::put('/leads/{lead}', [LeadApiController::class, 'update']);
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
// Route::post('/lead-details/{leadDetail}/close', [LeadApiController::class, 'closeIndividualVehicle']);

// Route::post('/lead-details', [LeadDetailController::class, 'store'])->name('lead-details.store');
Route::post('/lead-details', [LeadApiController::class, 'store']);

Route::get('/lead-details/open', [LeadApiController::class, 'openCount']);


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

Route::get('leads/converted-count', [LeadApiController::class, 'convertedCount']);
Route::get('leads/unrealized-count', [LeadApiController::class, 'unrealizedCount']);
// Route::get('leads/converted', [LeadApiController::class, 'getConvertedLeads']);
Route::get('converted-leads', [LeadApiController::class, 'getConvertedLeads']);
Route::get('leads/unrealized', [LeadApiController::class, 'getUnrealizedLeads']);
Route::get('/variants/{variant}/colors-with-prices', [LeadApiController::class, 'getColorsWithPrices']);
