<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Services\FuelTypeService;
use App\Http\Requests\Admin\FuelTypeRequest;
use Illuminate\Http\Request;

class FuelTypeApiController extends Controller
{
    /** @var FuelTypeService */
    protected $fuelTypeService;

    public function __construct(FuelTypeService $fuelTypeService)
    {
        $this->fuelTypeService = $fuelTypeService;
    }

    // GET /api/fuel-types
    public function index()
    {
        $fuelTypes = $this->fuelTypeService->getAll();
        return response()->json($fuelTypes, 200);
    }

    // POST /api/fuel-types
    public function store(FuelTypeRequest $request)
    {
        $data = $request->only(['name']);
        $fuelType = $this->fuelTypeService->create($data);

        return response()->json([
            'message' => 'Fuel type created successfully',
            'data' => $fuelType
        ], 201);
    }

    // GET /api/fuel-types/{id}
    public function show($id)
    {
        $fuelType = $this->fuelTypeService->getById($id);

        if (!$fuelType) {
            return response()->json(['message' => 'Fuel type not found'], 404);
        }

        return response()->json($fuelType, 200);
    }

    // PUT /api/fuel-types/{id}
    public function update(FuelTypeRequest $request, $id)
    {
        $data = $request->only(['name']);
        $updated = $this->fuelTypeService->update($data, $id);

        if (!$updated) {
            return response()->json(['message' => 'Fuel type not found'], 404);
        }

        return response()->json(['message' => 'Fuel type updated successfully'], 200);
    }

    // DELETE /api/fuel-types/{id}
    public function destroy($id)
    {
        $deleted = $this->fuelTypeService->delete($id);

        if (!$deleted) {
            return response()->json(['message' => 'Fuel type not found'], 404);
        }

        return response()->json(['message' => 'Fuel type deleted successfully'], 200);
    }
}
