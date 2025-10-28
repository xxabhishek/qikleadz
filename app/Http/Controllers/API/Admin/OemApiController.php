<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\OEM;
use Illuminate\Http\Request;

class OemApiController extends Controller
{
    //
    public function index()
    {
        $oems = OEM::all();
        return response()->json([
            'success' => true,
            'data' => $oems
        ]);
    }

    /**
     * Store a newly created OEM.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:oem,name',
        ]);

        $oem = OEM::create($request->only('name'));

        return response()->json([
            'success' => true,
            'message' => 'OEM created successfully',
            'data' => $oem
        ], 201);
    }

    /**
     * Display the specified OEM.
     */
    public function show($id)
    {
        $oem = OEM::find($id);

        if (!$oem) {
            return response()->json([
                'success' => false,
                'message' => 'OEM not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $oem
        ]);
    }

    /**
     * Update the specified OEM.
     */
    public function update(Request $request, $id)
    {
        $oem = OEM::find($id);

        if (!$oem) {
            return response()->json([
                'success' => false,
                'message' => 'OEM not found'
            ], 404);
        }

        $request->validate([
            'name' => 'required|string|max:255|unique:oem,name,' . $oem->id,
        ]);

        $oem->update($request->only('name'));

        return response()->json([
            'success' => true,
            'message' => 'OEM updated successfully',
            'data' => $oem
        ]);
    }

    /**
     * Remove the specified OEM.
     */
    public function destroy($id)
    {
        $oem = OEM::find($id);

        if (!$oem) {
            return response()->json([
                'success' => false,
                'message' => 'OEM not found'
            ], 404);
        }

        $oem->delete();

        return response()->json([
            'success' => true,
            'message' => 'OEM deleted successfully'
        ]);
    }
}
