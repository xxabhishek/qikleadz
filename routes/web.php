<?php

use App\Http\Controllers\Admin\CCController;
use App\Http\Controllers\Admin\CityController;
use App\Http\Controllers\Admin\FuelTypeController;
use App\Http\Controllers\Admin\GalleryController;
use App\Http\Controllers\Admin\StateController;
use App\Http\Controllers\Admin\TransmissionController;
use App\Http\Controllers\Admin\VariantController;
use App\Http\Controllers\Admin\VehicleConfigController;
use App\Http\Controllers\Admin\VehicleUsageController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\VehicleSegmentController;
use App\Models\Gallery;

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
//brand route
Route::resource('brand', 'App\Http\Controllers\Admin\brandController');

//state route
Route::resource('state', StateController::class);
//city route
Route::resource('city', CityController::class);

//Vehicle-Config
Route::resource('vehicle_configs', VehicleConfigController::class);
//Color
Route::resource('color', 'App\Http\Controllers\Admin\ColorController');
//cc route
Route::resource('cc', CCController::class);
//transmisssion route
Route::resource('transmission', TransmissionController::class);
//Gallery route
Route::resource('galleries', GalleryController::class);

Route::get('/get-vehicle-types/{countryId}', [VehicleSegmentController::class, 'getByCountry']);
Route::get('/get-industry-types-by-vehicle/{vehicleId}', [VehicleUsageController::class, 'getByVehicle']);

// Route::get('/home', action: [App\Http\Controllers\HomeController::class, 'index'])->name('home');

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])
    ->middleware('auth')
    ->name('home');






// use App\Http\Controllers\Admin\CityController;
// use App\Http\Controllers\Admin\FuelTypeController;
// use App\Http\Controllers\Admin\IndustryTypeController;
// use App\Http\Controllers\Admin\StateController;
// use App\Http\Controllers\Admin\VariantController;
// use App\Http\Controllers\Admin\VehicleConfigController;
// use Illuminate\Support\Facades\Auth;
// use Illuminate\Support\Facades\Route;
// use App\Http\Controllers\Admin\VehicleTypeController;

// /*
// |--------------------------------------------------------------------------
// | Web Routes
// |--------------------------------------------------------------------------
// |
// | Here is where you can register web routes for your application. These
// | routes are loaded by the RouteServiceProvider within a group which
// | contains the "web" middleware group. Now create something great!
// |
// */

// Route::get('/', function () {
//     return view('auth.login');
// })->name('login');

// Auth::routes();

// Route::group(['middleware' => ['auth', 'permission:view home']], function () {
//     Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
// });

// Route::group(['middleware' => ['auth']], function () {
//     // SuperAdmin-only routes
//     Route::group(['middleware' => ['role:superadmin']], function () {
//         Route::resource('roles', 'App\Http\Controllers\Admin\RoleController');
//     });

//     // SuperAdmin and Admin routes
//     Route::group(['middleware' => ['role:superadmin|admin']], function () {
//         Route::resource('users', 'App\Http\Controllers\Admin\UserController');
//         Route::resource('vehicle-types', VehicleTypeController::class);
//         Route::resource('industry-types', IndustryTypeController::class);
//         Route::resource('fuel-types', FuelTypeController::class);
//         Route::resource('variants', VariantController::class);
//         Route::resource('country', 'App\Http\Controllers\Admin\CountryController');
//         Route::resource('model', 'App\Http\Controllers\Admin\ModelController');
//         Route::resource('state', StateController::class);
//         Route::resource('city', CityController::class);
//         Route::resource('vehicle_configs', VehicleConfigController::class);
//         Route::resource('color', 'App\Http\Controllers\Admin\ColorController');
//     });

//     // Custom routes for vehicle-types and industry-types
//     Route::group(['middleware' => ['permission:view vehicle-types by country']], function () {
//         Route::get('/get-vehicle-types/{countryId}', [VehicleTypeController::class, 'getByCountry']);
//     });

//     Route::group(['middleware' => ['permission:view industry-types by vehicle']], function () {
//         Route::get('/get-industry-types-by-vehicle/{vehicleId}', [IndustryTypeController::class, 'getByVehicle']);
//     });
// });
