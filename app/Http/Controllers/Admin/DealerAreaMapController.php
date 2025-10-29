<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Area;
use App\Models\DealerAreaMap;
use Illuminate\Http\Request;

class DealerAreaMapController extends Controller
{
    //
    // // app/Http/Controllers/Admin/DealerAreaMapController.php
    // public function areasByCity($cityId)
    // {
    //     $maps = DealerAreaMap::where('city_id', $cityId)
    //         ->with('dealer:id,name')   // eager-load dealer name
    //         ->get();

    //     $areas = collect();
    //     foreach ($maps as $map) {
    //         $dealer = $map->dealer;
    //         $areaIds = array_filter(explode(',', $map->area_id));

    //         foreach ($areaIds as $areaId) {
    //             $area = Area::find($areaId);
    //             if ($area) {
    //                 $areas->push([
    //                     'id' => $area->id,
    //                     'name' => $area->name,
    //                     'dealer_id' => $dealer->id,
    //                     'dealer_name' => $dealer->name,
    //                 ]);
    //             }
    //         }
    //     }

    //     // remove duplicates (same area can belong to many dealers)
    //     $unique = $areas->unique('id')->values();

    //     return response()->json($unique);
    // }

    // Add this method to DealerAreaMapController
public function getDealerAreas(Request $request)
{
    try {
        $dealerId = $request->input('dealer_id');
        $cityId = $request->input('city_id');

        if (!$dealerId || !$cityId) {
            return response()->json([
                'success' => false,
                'message' => 'Dealer ID and City ID are required'
            ], 400);
        }

        // Get dealer area mapping
        $dealerAreas = DealerAreaMap::where('user_id', $dealerId)
            ->where('city_id', $cityId)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $dealerAreas
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error fetching dealer areas: ' . $e->getMessage()
        ], 500);
    }
}
}
