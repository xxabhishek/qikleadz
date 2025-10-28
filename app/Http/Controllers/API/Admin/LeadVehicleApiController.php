<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\LeadVehicle;
use Illuminate\Http\Request;

class LeadVehicleApiController extends Controller
{
    public function index($lead_id)
    {
        $vehicles = LeadVehicle::where('lead_id', $lead_id)
            ->with(['variant', 'brand', 'vehicleUsage', 'vehicleSegment', 'fuelType', 'vehicleConfig', 'country', 'oem'])
            ->get();

        return response()->json([
            'success' => true,
            'data' => $vehicles,
        ]);
    }

    public function show($id)
    {
        $vehicle = LeadVehicle::with(['variant', 'brand', 'vehicleUsage', 'vehicleSegment', 'fuelType', 'vehicleConfig', 'country', 'oem'])
            ->find($id);

        if (!$vehicle) {
            return response()->json([
                'success' => false,
                'message' => 'Vehicle not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $vehicle
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'lead_id' => 'required|exists:leads,id',
            'variant_id' => 'required|exists:variants,id',
            'brand_id' => 'required|exists:brands,id',
            'vehicle_qty' => 'required|integer|min:1',
        ]);

        $vehicle = LeadVehicle::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Vehicle added successfully.',
            'data' => $vehicle,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $vehicle = LeadVehicle::find($id);

        if (!$vehicle) {
            return response()->json([
                'success' => false,
                'message' => 'Vehicle not found'
            ], 404);
        }

        $vehicle->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Vehicle updated successfully.',
            'data' => $vehicle
        ]);
    }

    public function destroy($id)
    {
        $vehicle = LeadVehicle::find($id);

        if (!$vehicle) {
            return response()->json([
                'success' => false,
                'message' => 'Vehicle not found'
            ], 404);
        }

        $vehicle->delete();

        return response()->json([
            'success' => true,
            'message' => 'Vehicle deleted successfully.'
        ]);
    }
}