<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class DealerMappingController extends Controller
{
    /**
     * Get dealer and distributor mapping for a specific area
     */
    public function getDealerDistributorMapping(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'area_id' => 'required|integer',
                'city_id' => 'required|integer',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $areaId = $request->area_id;
            $cityId = $request->city_id;

            Log::info('Fetching dealer mapping:', [
                'area_id' => $areaId,
                'city_id' => $cityId
            ]);

            // Find dealer mapped to this area using dealer_area_map table
            $dealerAreaMap = DB::table('dealer_area_map')
                ->where('city_id', $cityId)
                ->where(function ($query) use ($areaId) {
                    $query->where('area_id', $areaId)
                        ->orWhere('area_id', 'LIKE', "%,{$areaId},%")
                        ->orWhere('area_id', 'LIKE', "{$areaId},%")
                        ->orWhere('area_id', 'LIKE', "%,{$areaId}");
                })
                ->first();

            if ($dealerAreaMap) {
                $dealerId = $dealerAreaMap->user_id;

                // Find distributor for this dealer using distributor_dealer_map table
                $distributorMap = DB::table('distributor_dealer_map')
                    ->where('dealer_id', $dealerId)
                    ->first();

                // Get dealer and distributor details from users table
                $dealer = DB::table('users')->where('id', $dealerId)->first();
                $distributor = $distributorMap ? DB::table('users')->where('id', $distributorMap->user_id)->first() : null;

                return response()->json([
                    'success' => true,
                    'dealer_id' => $dealerId,
                    'distributor_id' => $distributorMap ? $distributorMap->user_id : null,
                    'dealer_name' => $dealer ? $dealer->name : 'Unknown Dealer',
                    'distributor_name' => $distributor ? $distributor->name : 'No Distributor',
                    'message' => 'Dealer and distributor mapping found successfully'
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'No dealer mapped for this area'
            ], 404);

        } catch (\Exception $e) {
            Log::error('Error fetching dealer mapping:', [
                'error' => $e->getMessage(),
                'area_id' => $request->area_id,
                'city_id' => $request->city_id
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error fetching dealer mapping: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Alternative method - same functionality different name
     */
    public function getDealerForArea(Request $request): JsonResponse
    {
        return $this->getDealerDistributorMapping($request);
    }
}
