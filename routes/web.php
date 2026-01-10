<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\CountryController;
use App\Http\Controllers\Admin\StateController;
use App\Http\Controllers\Admin\CityController;
use App\Http\Controllers\Admin\VehicleSegmentController;
use App\Http\Controllers\Admin\VehicleUsageController;
use App\Http\Controllers\Admin\FuelTypeController;
use App\Http\Controllers\Admin\VariantController;
use App\Http\Controllers\Admin\LeadController;
use App\Http\Controllers\DistributorController;
use App\Http\Controllers\DealerController;
use App\Http\Controllers\Admin\AreaController;
use App\Http\Controllers\Admin\DealerAreaMapController;
use App\Http\Controllers\Admin\CurrencyController;
use App\Http\Controllers\Admin\CCController;
use App\Http\Controllers\Admin\GalleryController;
use App\Http\Controllers\Admin\TransmissionController;
use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\VehicleConfigController;
use App\Http\Controllers\Admin\ColorController;
use App\Http\Controllers\Admin\OEMController;
use App\Http\Controllers\Admin\FeatureController;
use App\Http\Controllers\Admin\TechSpecController;
use App\Http\Controllers\Admin\PaymentModeController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\DashboardController;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return view('auth.login');
})->name('root');

Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.post');
Route::get('/logout', [AuthController::class, 'logout'])->name('logout');
// Route::get('/logout', [AuthController::class, 'logout'])->name('frontend.logout');


// Route::get('/fix-relationships', [DashboardController::class, 'fixRelationships'])
//      ->name('fix.relationships');

// // Universal lead assignment
// Route::post('/leads/assign-to-dealer', [DashboardController::class, 'assignLeadToDealer'])
//      ->name('leads.assign.to.dealer');

// Password Reset
Route::get('/forgot-password', function () {
    return view('auth.forgot-password');
})->name('password.request');
Route::post('/forgot-password', [AuthController::class, 'sendResetLinkWeb'])->name('password.email');
Route::get('/reset-password/{token}', [AuthController::class, 'showResetPasswordForm'])->name('password.reset');
Route::post('/reset-password', [AuthController::class, 'resetPasswordWeb'])->name('password.update');

Route::middleware(['auth'])->group(function () {

    Route::get('/dashboard', function () {
        return view('layouts.structure');
    })->name('admin.dashboard');

    // Home route for role-based redirection
    Route::get('/home', [HomeController::class, 'index'])->name('home');

    Route::prefix('admin')->name('admin.')->middleware('role:1')->group(function () {
        // Area Management
        Route::get('/areas', [AreaController::class, 'index'])->name('areas.index');
        Route::get('/areas/create', [AreaController::class, 'create'])->name('areas.create');
        Route::post('/areas', [AreaController::class, 'store'])->name('areas.store');
        Route::get('/areas/{id}/edit', [AreaController::class, 'edit'])->name('areas.edit');
        Route::put('/areas/{id}', [AreaController::class, 'update'])->name('areas.update');
        Route::delete('/areas/{id}', [AreaController::class, 'destroy'])->name('areas.destroy');
    });

    // Admin Resources
    Route::resource('users', UserController::class);
    Route::post('/users/{id}/logo', [UserController::class, 'updateLogo'])->name('users.updateLogo');
    Route::resource('roles', RoleController::class);

    Route::prefix('executive')->name('executive.')->middleware('role:2')->group(function () {
        // Executive Dashboard
        Route::get('/dashboard', function () {
            return view('executive.dashboard');
        })->name('dashboard');

        // Alternative executive dashboard from HomeController
        Route::get('/exe-dashboard', [HomeController::class, 'ExeDashboard'])->name('exe-dashboard');
    });


    Route::prefix('dealer')->name('dealer.')->middleware('role:3')->group(function () {
        // Dealer Dashboard
        Route::get('/dashboard', [DealerController::class, 'dashboard'])->name('dashboard');
        Route::get('/leads', [DealerController::class, 'leads'])->name('leads');
        // Route::get('/leads/{id}', [DealerController::class, 'showLead'])->name('leads.show');
        Route::post('/leads/{id}/update-status', [DealerController::class, 'updateLeadStatus'])->name('leads.update-status');
        Route::get('/statistics', [DealerController::class, 'getStatistics'])->name('statistics');
    });

    Route::prefix('distributor')->name('distributor.')->group(function () {
        // Distributor Dashboard
        Route::get('/dashboard', [DistributorController::class, 'dashboard'])->name('dashboard');
        Route::get('/leads', [DistributorController::class, 'leads'])->name('leads');
        Route::get('/leads/{id}', [DistributorController::class, 'showLead'])->name('leads.show');
        Route::post('/leads/{id}/update-status', [DistributorController::class, 'updateLeadStatus'])->name('leads.update-status');
        Route::get('/statistics', [DistributorController::class, 'getStatistics'])->name('statistics');
        Route::get('/credit-note/{detailId}', [DistributorController::class, 'generateCreditNote'])
            ->name('credit-note');
    });
    Route::get('/distributor/pending-verification-leads', [DistributorController::class, 'pendingVerificationLeads'])
        ->name('distributor.pending-verification-leads');
    // Route::get('/distributor/invoice-note/{detailId}', [DistributorController::class, 'generateInvoiceNote'])->name('distributor.generate-credit-note');


    // Country, State, City
    Route::resource('country', CountryController::class);
    Route::post('country/bulk-upload', [CountryController::class, 'bulkUpload'])->name('country.bulkUpload');
    Route::resource('state', StateController::class);
    Route::resource('city', CityController::class);

    // Vehicle Related
    Route::resource('vehicle-segment', VehicleSegmentController::class);
    Route::resource('vehicle-usage', VehicleUsageController::class);
    Route::resource('fuel-types', FuelTypeController::class);
    Route::resource('variants', VariantController::class);
    Route::resource('brand', BrandController::class);
    Route::resource('vehicle-config', VehicleConfigController::class);
    Route::resource('color', ColorController::class);
    Route::resource('oem', OEMController::class);
    Route::resource('feature', FeatureController::class);
    Route::resource('tech-spec', TechSpecController::class);
    Route::resource('cc', CCController::class);
    Route::resource('transmission', TransmissionController::class);
    Route::resource('galleries', GalleryController::class);
    Route::resource('payment-mode', PaymentModeController::class);

    // Area Resources
    Route::resource('dealer-area-map', DealerAreaMapController::class);
    Route::resource('currency', CurrencyController::class);

    // Leads Management
    Route::resource('lead', LeadController::class);
    Route::get('vehiclefilterData', [LeadController::class, 'VehicleFilterData'])->name('vehiclefilterData');
    Route::get('/leads/next/{gallery}', [LeadController::class, 'nextStep'])->name('leads.next');
    Route::post('/customer-details', [LeadController::class, 'createLead'])->name('customer.details');
    Route::get('/leads/model-details/{variantId}', [LeadController::class, 'modelDetails'])->name('leads.model_details');
    Route::post('/leads/lead-information', [LeadController::class, 'leadInformation'])->name('leads.lead_information');
    Route::post('/leads/{leadId}/vehicles', [LeadController::class, 'addVehicle'])->name('leads.add_vehicle');
    Route::get('/leads/summary/{leadId}', [LeadController::class, 'summary'])->name('leads.summary');
    Route::get('/leads/submit/{leadId}', [LeadController::class, 'submitAll'])->name('leads.submit_all');
    Route::get('/leads/thank-you', [LeadController::class, 'thankYou'])->name('leads.thank_you');
});

Route::get('getByCountry/{country_id}', [CountryController::class, 'getByCountry'])->name('getByCountry');
Route::get('getByCountrySelectBrand/{country_id}', [CountryController::class, 'getByCountrySelectBrand'])->name('getByCountrySelectBrand');
Route::get('getByBrandSelectVariant/{brand_id}', [CountryController::class, 'getByBrandSelectVariant'])->name('getByBrandSelectVariant');
Route::get('/admin/areas-by-city/{city_id}', [DealerAreaMapController::class, 'getAreasByCity'])->name('getByDealerCity');
Route::get('/admin/dealer-areas', [DealerAreaMapController::class, 'getDealerAreas'])->name('dealer-areas.get');

// AJAX Helpers
Route::get('/states-by-country/{countryId}', function ($countryId) {
    return \App\Models\State::where('country_id', $countryId)->get();
})->name('admin.states.by.country');
Route::get('/cities-by-state/{stateId}', function ($stateId) {
    return \App\Models\City::where('state_id', $stateId)->get();
})->name('admin.cities.by.state');

Route::prefix('distributor')->name('distributor.')->middleware('role:4')->group(function () {
    // Dashboard
    Route::get('/dashboard', [DistributorController::class, 'dashboard'])->name('dashboard');

    // Leads
    Route::get('/leads', [DistributorController::class, 'leads'])->name('leads');
    Route::get('/leads/{id}', [DistributorController::class, 'showLead'])->name('leads.show');

    // Claims
    Route::get('/claims', [DistributorController::class, 'claims'])->name('claims');
    Route::get('/claims/{id}', [DistributorController::class, 'showClaim'])->name('claims.show');
    Route::put('/claims/{id}', [DistributorController::class, 'updateClaimStatus'])->name('claims.update');

    // Converted Leads & Create Claims
    Route::get('/converted-leads', [DistributorController::class, 'convertedLeads'])->name('converted-leads');
    Route::post('/claims/create/{leadId}', [DistributorController::class, 'createClaim'])->name('claims.create');

    Route::get('/credit-notes', [DistributorController::class, 'creditNotes'])->name('distributor.credit-notes');
    Route::get('/incentive-payments', [DistributorController::class, 'incentivePayments'])->name('distributor.incentive-payments');
    Route::get('/payouts', [DistributorController::class, 'payouts'])->name('distributor.payouts');

    Route::get('/successful-leads', [DistributorController::class, 'successfulLeads'])
        ->name('successful-leads');

    Route::get('/converted-leads', [DistributorController::class, 'convertedLeads'])
        ->name('converted-leads');
    // Route::get('/disputed-leads', [DistributorController::class, 'disputedLeads'])
    //     ->name('disputed-leads');
    Route::get('/payouts', [DistributorController::class, 'payouts'])->name('payouts');

    Route::get('/invoice-note/{detailId}', [DistributorController::class, 'generateInvoiceNote'])
        ->name('invoice-note');

    Route::post('/generate-selected-credit-note', [DistributorController::class, 'generateCreditNote'])
        ->name('generate-selected-credit-note');
    Route::get('/pay-details/{executiveId}', [DistributorController::class, 'payDetails'])
        ->name('pay-details');
    Route::get('/list-credit-note', [DistributorController::class, 'listCreditNote'])
        ->name('list-credit-note');
});


Route::post('/distributor/generate-selected-invoice', [DistributorController::class, 'generateSelectedInvoice'])
    ->name('distributor.generate-selected-invoice')
    ->middleware('auth');
Route::post('/leads/{leadId}/verify/{detailId}', [DistributorController::class, 'verifyLead'])
    ->name('distributor.leads.verify');
Route::get('/leads/{id}/claim-details', [DistributorController::class, 'claimDetails'])
    ->name('leads.claim-details');

Route::post('/test-verify', function (Illuminate\Http\Request $request) {
    return response()->json(['success' => true, 'message' => 'Test verification successful']);
})->name('test.verify');


Route::get('/diagnose-payouts', function () {
    $distributor = Auth::user();

    // Check executives under this distributor
    $executives = \App\Models\User::where('role', 2)
        ->where('parent_id', $distributor->id)
        ->get();

    // Check dealers under this distributor
    $dealers = \App\Models\User::where('role', 3)
        ->where('parent_id', $distributor->id)
        ->get();

    // Check leads to see relationships
    $leads = \App\Models\Lead::where('distributor_id', $distributor->id)
        ->with(['executive', 'dealer'])
        ->get()
        ->map(function ($lead) {
            return [
                'lead_id' => $lead->id,
                'executive_id' => $lead->executive_id,
                'executive_name' => $lead->executive->name ?? null,
                'dealer_id' => $lead->dealer_id,
                'dealer_name' => $lead->dealer->name ?? null,
            ];
        });

    return response()->json([
        'distributor' => [
            'id' => $distributor->id,
            'name' => $distributor->name
        ],
        'direct_executives' => $executives->map->only(['id', 'name', 'parent_id']),
        'direct_dealers' => $dealers->map->only(['id', 'name', 'parent_id']),
        'leads_relationships' => $leads,
        'notes' => [
            'Your distributor should have executives (role 2) with parent_id = 9',
            'Currently you have 1 executive: Shahaji (ID 25)',
            'Your payouts table is showing dealers instead of executives'
        ]
    ]);
});



Route::resource('color-wise-variant-rate', 'App\Http\Controllers\Admin\ColorWiseVariantRateController');
