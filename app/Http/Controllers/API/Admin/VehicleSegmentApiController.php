<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\VehicleSegment;
use Illuminate\Http\Request;

class VehicleSegmentApiController extends Controller
{
    public function index()
    {
        $segments = VehicleSegment::all();

        return response()->json([
            'status' => true,
            'data' => $segments
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'country_id' => 'required|integer|exists:countries,id',
        ]);

        $segment = VehicleSegment::create([
            'name' => $request->name,
            'country_id' => $request->country_id,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Vehicle segment created successfully',
            'data' => $segment
        ], 201);
    }

    public function show($id)
    {
        $segment = VehicleSegment::findOrFail($id);

        return response()->json([
            'status' => true,
            'data' => $segment
        ]);
    }

    public function update(Request $request, $id)
    {
        $segment = VehicleSegment::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'country_id' => 'required|integer|exists:countries,id',
        ]);

        $segment->update($request->only(['name', 'country_id']));

        return response()->json([
            'status' => true,
            'message' => 'Vehicle segment updated successfully',
            'data' => $segment
        ]);
    }

    public function destroy($id)
    {
        $segment = VehicleSegment::findOrFail($id);
        $segment->delete();

        return response()->json([
            'status' => true,
            'message' => 'Vehicle segment deleted successfully'
        ]);
    }
}
