<?php

use App\Http\Controllers\Admin\CityController;
use App\Http\Controllers\Admin\CountryController;
use App\Http\Controllers\Admin\FuelTypeController;
use App\Http\Controllers\Admin\LeadController;
use App\Http\Controllers\Admin\VehicleUsageController;
use App\Http\Controllers\Admin\StateController;
use App\Http\Controllers\Admin\VariantController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\VehicleSegmentController;
use App\Http\Controllers\Admin\CCController;
use App\Http\Controllers\Admin\GalleryController;
use App\Http\Controllers\Admin\TransmissionController;
use App\Http\Controllers\Admin\AreaController;


/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('auth.login');
});

Auth::routes();
Route::group(['middleware' => ['auth']], function () {
    Route::resource('roles', 'App\Http\Controllers\Admin\RoleController');
    Route::resource('users', 'App\Http\Controllers\Admin\UserController');
});

Route::post('/users/{id}/logo', action: ['App\Http\Controllers\Admin\UserController'::class, 'updateLogo'])->name('users.updateLogo');


//Vehicle type route
Route::resource('vehicle-segment', VehicleSegmentController::class);
//Industry type route
Route::resource('vehicle-usage', VehicleUsageController::class);

//Fuel Type route
Route::resource('fuel-types', FuelTypeController::class);
//Variant route
Route::resource('variants', VariantController::class);
//Country riute
Route::resource('country', 'App\Http\Controllers\Admin\CountryController');

Route::post('country/bulk-upload', [CountryController::class, 'bulkUpload'])->name('country.bulkUpload');
//model route
Route::resource('brand', 'App\Http\Controllers\Admin\BrandController');

//state route
Route::resource('state', StateController::class);
//city route
Route::resource('city', CityController::class);
//Vehicle-Config
Route::resource('vehicle-config', 'App\Http\Controllers\Admin\VehicleConfigController');
//Color
Route::resource('color', 'App\Http\Controllers\Admin\ColorController');
Route::resource('oem', 'App\Http\Controllers\Admin\OEMController');
Route::resource('feature', 'App\Http\Controllers\Admin\FeatureController');
Route::resource('tech-spec', 'App\Http\Controllers\Admin\TechSpecController');

Route::resource('cc', CCController::class);
//transmisssion route
Route::resource('transmission', TransmissionController::class);
//Gallery route
Route::resource('galleries', GalleryController::class);

Route::get('getByCountry/{country_id}', 'App\Http\Controllers\Admin\CountryController@getByCountry')->name('getByCountry');
Route::get('getByCountrySelectBrand/{country_id}', 'App\Http\Controllers\Admin\CountryController@getByCountrySelectBrand')->name('getByCountrySelectBrand');
Route::get('getByBrandSelectVariant/{brand_id}', 'App\Http\Controllers\Admin\CountryController@getByBrandSelectVariant')->name('getByBrandSelectVariant');






// Route::get('/get-vehicle-types/{countryId}', [\App\Http\Controllers\Admin\VehicleTypeController::class, 'getByCountry']);
// Route::get('/get-industry-types-by-vehicle/{vehicleId}', [\App\Http\Controllers\Admin\IndustryTypeController::class, 'getByVehicle']);

// Route::get('/home', action: [App\Http\Controllers\HomeController::class, 'index'])->name('home');

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])
    ->middleware('auth')
    ->name('home');


Route::resource('lead', 'App\Http\Controllers\Admin\LeadController');
Route::get('vehiclefilterData', 'App\Http\Controllers\Admin\LeadController@VehicleFilterData')->name('vehiclefilterData');
Route::get('/leads/next/{gallery}', 'App\Http\Controllers\Admin\LeadController@nextStep')->name('leads.next');
Route::post('/customer-details', 'App\Http\Controllers\Admin\LeadController@createLead')->name('customer.details');



Route::get('/leads', [LeadController::class, 'index'])->name('leads.index');
Route::post('/leads', [LeadController::class, 'store'])->name('leads.store');
Route::get('/leads/{id}', [LeadController::class, 'show'])->name('leads.show');
Route::put('/leads/{id}', [LeadController::class, 'update'])->name('leads.update');
Route::delete('/leads/{id}', [LeadController::class, 'destroy'])->name('leads.destroy');
Route::get('/leads/model-details/{variantId}', [LeadController::class, 'modelDetails'])->name('leads.model_details');
Route::post('/leads/lead-information', [LeadController::class, 'leadInformation'])->name('leads.lead_information');
Route::post('/leads/store', [LeadController::class, 'store'])->name('leads.store');
Route::post('/leads/{leadId}/vehicles', [LeadController::class, 'addVehicle'])->name('leads.add_vehicle');
Route::get('/leads/summary/{leadId}', [LeadController::class, 'summary'])->name('leads.summary');
Route::get('/leads/submit/{leadId}', [LeadController::class, 'submitAll'])->name('leads.submit_all');
Route::get('/leads/thank-you', [LeadController::class, 'thankYou'])->name('leads.thank_you');




Route::prefix('admin')->group(function () {
    Route::get('/areas', [AreaController::class, 'index'])->name('admin.areas.index');
    Route::get('/areas/create', [AreaController::class, 'create'])->name('admin.areas.create');
    Route::post('/areas', [AreaController::class, 'store'])->name('admin.areas.store');
    Route::get('/areas/{id}/edit', [AreaController::class, 'edit'])->name('admin.areas.edit');
    Route::put('/areas/{id}', [AreaController::class, 'update'])->name('admin.areas.update');
    Route::delete('/areas/{id}', [AreaController::class, 'destroy'])->name('admin.areas.destroy');
    Route::get('/states-by-country/{countryId}', function ($countryId) {
        return \App\Models\State::where('country_id', $countryId)->get();
    })->name('admin.states.by.country');
    Route::get('/cities-by-state/{stateId}', function ($stateId) {
        return \App\Models\City::where('state_id', $stateId)->get();
    })->name('admin.cities.by.state');
});
