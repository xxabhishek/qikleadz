<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\TransmissionRequest;
use App\Models\Transmission;
use Illuminate\Http\Request;

class TransmissionApiController extends Controller
{
    public function index()
    {
        return response([
            'status' => true,
            'data' => Transmission::all()
        ]);
    }

    public function store(TransmissionRequest $request)
{
    $transmission = Transmission::create($request->validated());

    return response()->json([
        'status' => true,
        'message' => 'Transmission created successfully',
        'data' => $transmission
    ], 201);
}

    public function show($id)
    {
        $transmission = Transmission::findOrFail($id);
        return response([
            'status' => true,
            "data" => $transmission
        ]);
    }

    public function update(TransmissionRequest $request, $id)
{
    $transmission = Transmission::findOrFail($id);
    $transmission->update($request->validated());

    return response()->json([
        'status' => true,
        'message' => 'Transmission updated successfully',
        'data' => $transmission
    ]);
}

    public function destroy($id)
    {
        $transmission = Transmission::findOrFail($id);
        $transmission->delete();

        return response()->json([
            'status' => true,
            'message' => 'Transission deleted successfully'
        ]);
    }
}