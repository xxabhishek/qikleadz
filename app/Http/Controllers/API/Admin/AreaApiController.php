<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Area;
use App\Models\State;
use App\Models\City;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AreaApiController extends Controller
{
    /**
     * Display a listing of areas.
     */

    public function getCities(Request $request): JsonResponse
    {
        $search = $request->query('search');
        $query = City::with(['state'])
            ->when($search, function ($query, $search) {
                return $query->where('name', 'like', "%{$search}%");
            })
            ->take(10)
            ->get();

        $cities = $query->map(function ($city) {
            return [
                'id' => $city->id,
                'name' => $city->name,
                'state_id' => $city->state_id,
                'state_name' => $city->state->name ?? 'N/A',
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $cities,
            'message' => 'Cities retrieved successfully',
        ]);
    }

    // Existing methods (index, getStatesByCountry, getCitiesByState) remain unchanged
    // public function index(Request $request): JsonResponse
    // {
    //     $search = $request->query('search');
    //     $query = Area::with(['city', 'state', 'country'])
    //         ->when($search, function ($query, $search) {
    //             return $query->whereHas('city', function ($q) use ($search) {
    //                 $q->where('name', 'like', "%{$search}%");
    //             });
    //         })
    //         ->take(10)
    //         ->get();

    //     $areas = $query->map(function ($area) {
    //         return [
    //             'id' => $area->id,
    //             'name' => $area->name,
    //             'city_id' => $area->city_id,
    //             'state_id' => $area->state_id,
    //             'country_id' => $area->country_id,
    //             'city_name' => $area->city->name ?? 'N/A',
    //             'state_name' => $area->state->name ?? 'N/A',
    //             'country_name' => $area->country->name ?? 'N/A',
    //         ];
    //     });

    //     return response()->json([
    //         'success' => true,
    //         'data' => $areas,
    //         'message' => 'Areas retrieved successfully',
    //     ]);
    // }

    public function index(Request $request): JsonResponse
    {
        $search = $request->query('search');

        $query = Area::query()
            ->select([
                'areas.id',
                'areas.name',
                'areas.city_id',
                'areas.state_id',
                'areas.country_id',
                'cities.name as city_name',
                'states.name as state_name',
                'countries.name as country_name',
            ])
            ->leftJoin('cities', 'areas.city_id', '=', 'cities.id')
            ->leftJoin('states', 'areas.state_id', '=', 'states.id')
            ->leftJoin('countries', 'areas.country_id', '=', 'countries.id')
            ->when($search, function ($q) use ($search) {
                return $q->where(function ($qq) use ($search) {
                    $qq->where('areas.name', 'like', "%{$search}%")
                        ->orWhere('cities.name', 'like', "%{$search}%");
                });
            })
            ->take(50) // Increased for better UX
            ->get();

        return response()->json([
            'success' => true,
            'data' => $query,
            'message' => 'Areas retrieved successfully',
        ]);
    }

    /**
     * Get states by country ID
     */
    public function getStatesByCountry($countryId): JsonResponse
    {
        try {
            $states = State::where('country_id', $countryId)
                ->select('id', 'name')
                ->orderBy('name')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $states
            ]);

        } catch (\Exception $e) {
            Log::error('States API error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch states'
            ], 500);
        }
    }

    /**
     * Get cities by state ID
     */
    public function getCitiesByState($stateId): JsonResponse
    {
        try {
            $cities = City::where('state_id', $stateId)
                ->select('id', 'name')
                ->orderBy('name')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $cities
            ]);

        } catch (\Exception $e) {
            Log::error('Cities API error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch cities'
            ], 500);
        }
    }

    /**
     * Search locations (cities) by name - FIXED VERSION
     */
    public function searchLocations(Request $request): JsonResponse
    {
        try {
            $search = $request->query('search', '');

            Log::info('Searching locations:', ['search' => $search]);

            // Search in cities table instead of areas table
            $locations = DB::table('cities')
                ->select(
                    'cities.id',
                    'cities.name as city_name',
                    'cities.name',
                    'cities.state_id',
                    'states.name as state_name'
                )
                ->leftJoin('states', 'cities.state_id', '=', 'states.id')
                ->where('cities.name', 'LIKE', "%{$search}%")
                ->take(10)
                ->get();

            return response()->json([
                'success' => true,
                'data' => $locations,
                'message' => 'Locations retrieved successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Error searching locations:', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to search locations: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all areas for a specific city - FIXED VERSION
     */
    public function getAreasByCity($cityId): JsonResponse
    {
        try {
            Log::info('Fetching areas for city:', ['city_id' => $cityId]);

            // Get areas by city_id from areas table
            $areas = DB::table('areas')
                ->where('city_id', $cityId)
                ->select('id', 'name', 'city_id', 'state_id')
                ->get();

            // Get city name for reference
            $city = DB::table('cities')->where('id', $cityId)->first();
            $cityName = $city ? $city->name : 'Unknown City';

            return response()->json([
                'success' => true,
                'data' => $areas,
                'city_name' => $cityName,
                'message' => 'Areas retrieved successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching areas by city:', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch areas: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get dealer assigned areas for a specific city - FIXED VERSION
     */
    public function getDealerAreasByCity(Request $request, $cityId): JsonResponse
    {
        try {
            $dealerId = $request->query('dealer_id');

            Log::info('Fetching dealer areas:', [
                'city_id' => $cityId,
                'dealer_id' => $dealerId
            ]);

            // Get city name
            $city = DB::table('cities')->where('id', $cityId)->first();
            if (!$city) {
                return response()->json([
                    'success' => false,
                    'message' => 'City not found'
                ], 404);
            }

            $cityName = $city->name;
            $areas = [];
            $isDealerAssigned = false;

            if ($dealerId) {
                // Get dealer's assigned areas for this city
                $dealerAreaMap = DB::table('dealer_area_map')
                    ->where('user_id', $dealerId)
                    ->where('city_id', $cityId)
                    ->first();

                if ($dealerAreaMap && $dealerAreaMap->area_id) {
                    $areaIds = array_map('trim', explode(',', $dealerAreaMap->area_id));

                    $areas = DB::table('areas')
                        ->whereIn('id', $areaIds)
                        ->where('city_id', $cityId)
                        ->select('id', 'name', 'city_id', 'state_id')
                        ->get();

                    $isDealerAssigned = true;

                    Log::info('Found dealer assigned areas:', [
                        'dealer_id' => $dealerId,
                        'area_ids' => $areaIds,
                        'areas_count' => $areas->count()
                    ]);
                }
            }

            // If no dealer areas found, get all areas for the city
            if (!$isDealerAssigned || $areas->isEmpty()) {
                $areas = DB::table('areas')
                    ->where('city_id', $cityId)
                    ->select('id', 'name', 'city_id', 'state_id')
                    ->get();

                Log::info('Showing all areas for city:', [
                    'city_name' => $cityName,
                    'areas_count' => $areas->count()
                ]);
            }

            return response()->json([
                'success' => true,
                'data' => $areas,
                'city_name' => $cityName,
                'is_dealer_assigned' => $isDealerAssigned,
                'message' => $isDealerAssigned ? 'Dealer assigned areas retrieved' : 'All areas for city retrieved'
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching dealer areas:', [
                'error' => $e->getMessage(),
                'city_id' => $cityId,
                'dealer_id' => $dealerId
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch dealer areas: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Debug function to check database structure
     */
    public function debugAreas(): JsonResponse
    {
        try {
            // Check cities table
            $cities = DB::table('cities')->select('id', 'name', 'state_id')->take(5)->get();

            // Check areas table
            $areas = DB::table('areas')->select('id', 'name', 'city_id', 'state_id')->take(5)->get();

            // Check dealer_area_map table
            $dealerMaps = DB::table('dealer_area_map')->select('id', 'user_id', 'city_id', 'area_id')->take(5)->get();

            // Check distributor_dealer_map table
            $distributorMaps = DB::table('distributor_dealer_map')->select('id', 'user_id', 'dealer_id')->take(5)->get();

            return response()->json([
                'cities_table' => [
                    'sample' => $cities,
                    'count' => DB::table('cities')->count()
                ],
                'areas_table' => [
                    'sample' => $areas,
                    'count' => DB::table('areas')->count()
                ],
                'dealer_area_map' => [
                    'sample' => $dealerMaps,
                    'count' => DB::table('dealer_area_map')->count()
                ],
                'distributor_dealer_map' => [
                    'sample' => $distributorMaps,
                    'count' => DB::table('distributor_dealer_map')->count()
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Debug error: ' . $e->getMessage()
            ], 500);
        }
    }
}
