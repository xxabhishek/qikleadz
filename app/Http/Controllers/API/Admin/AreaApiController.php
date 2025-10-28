<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Area;
use App\Models\State;
use App\Models\City;

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
    public function index(Request $request): JsonResponse
    {
        $search = $request->query('search');
        $query = Area::with(['city', 'state', 'country'])
            ->when($search, function ($query, $search) {
                return $query->whereHas('city', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
            })
            ->take(10)
            ->get();

        $areas = $query->map(function ($area) {
            return [
                'id' => $area->id,
                'name' => $area->name,
                'city_id' => $area->city_id,
                'state_id' => $area->state_id,
                'country_id' => $area->country_id,
                'city_name' => $area->city->name ?? 'N/A',
                'state_name' => $area->state->name ?? 'N/A',
                'country_name' => $area->country->name ?? 'N/A',
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $areas,
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
            \Log::error('States API error: ' . $e->getMessage());

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
            \Log::error('Cities API error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch cities'
            ], 500);
        }
    }
}
