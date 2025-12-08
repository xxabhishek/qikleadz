<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Area;
use App\Models\City;
use App\Models\DealerAreaMap;
use App\Models\User;
use Illuminate\Http\Request;

class DealerAreaMapController extends Controller
{
    // List all mappings
    public function index()
    {
        $dealerareaMaps = DealerAreaMap::with(['user', 'city'])->latest()->get();
        return view('admin.dealer-area-map.index', compact('dealerareaMaps'));
    }

    // Show create form
    public function create()
    {
        $dealers = User::role('dealer')->get(['id', 'name']);
        $cities = City::all(['id', 'name']);
        $areas = collect(); // will be loaded via AJAX

        return view('admin.dealer-area-map.create', compact('dealers', 'cities', 'areas'));
    }

    // Store new mapping
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'city_id' => 'required|exists:cities,id',
            'area_ids' => 'required|array',
            'area_ids.*' => 'exists:areas,id'
        ]);

        // Delete old mapping for this dealer + city (optional: or allow multiple)
        DealerAreaMap::where('user_id', $request->user_id)
            ->where('city_id', $request->city_id)
            ->delete();

        DealerAreaMap::create([
            'user_id' => $request->user_id,
            'city_id' => $request->city_id,
            'area_id' => implode(',', $request->area_ids),
        ]);

        return redirect()->route('dealer-area-map.index')
            ->with('success', 'Dealer area mapping created successfully.');
    }

    // Edit form
    public function edit($id)
    {
        $map = DealerAreaMap::findOrFail($id);
        $dealers = User::role('dealer')->get(['id', 'name']);
        $cities = City::all(['id', 'name']);
        $selectedAreas = explode(',', $map->area_id);

        return view('admin.dealer-area-map.edit', compact('map', 'dealers', 'cities', 'selectedAreas'));
    }

    // Update mapping
    public function update(Request $request, $id)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'city_id' => 'required|exists:cities,id',
            'area_ids' => 'required|array',
            'area_ids.*' => 'exists:areas,id'
        ]);

        $map = DealerAreaMap::findOrFail($id);

        $map->update([
            'user_id' => $request->user_id,
            'city_id' => $request->city_id,
            'area_id' => implode(',', $request->area_ids),
        ]);

        return redirect()->route('dealer-area-map.index')
            ->with('success', 'Dealer area mapping updated successfully.');
    }

    // Delete mapping
    public function destroy($id)
    {
        $map = DealerAreaMap::findOrFail($id);
        $map->delete();

        return redirect()->route('dealer-area-map.index')
            ->with('success', 'Dealer area mapping deleted successfully.');
    }

    // AJAX: Get areas by city
    public function getAreasByCity($city_id)
    {
        $areas = Area::where('city_id', $city_id)->pluck('name', 'id');
        return response()->json($areas);
    }

    // Optional: Get existing mapped areas for a dealer in a city
    public function getDealerAreas(Request $request)
    {
        $dealerId = $request->input('dealer_id');
        $cityId = $request->input('city_id');

        if (!$dealerId || !$cityId) {
            return response()->json(['success' => false, 'message' => 'Invalid parameters'], 400);
        }

        $map = DealerAreaMap::where('user_id', $dealerId)
            ->where('city_id', $cityId)
            ->first();

        $areaIds = $map ? array_filter(explode(',', $map->area_id)) : [];

        return response()->json([
            'success' => true,
            'mapped_area_ids' => $areaIds
        ]);
    }

    // public function getDealerAreas(Request $request)
    // {
    //     try {
    //         $dealerId = $request->input('dealer_id');
    //         $cityId = $request->input('city_id');

    //         if (!$dealerId || !$cityId) {
    //             return response()->json([
    //                 'success' => false,
    //                 'message' => 'Dealer ID and City ID are required'
    //             ], 400);
    //         }

    //         // Get dealer area mapping
    //         $dealerAreas = DealerAreaMap::where('user_id', $dealerId)
    //             ->where('city_id', $cityId)
    //             ->get();

    //         return response()->json([
    //             'success' => true,
    //             'data' => $dealerAreas
    //         ]);

    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Error fetching dealer areas: ' . $e->getMessage()
    //         ], 500);
    //     }
    // }
}