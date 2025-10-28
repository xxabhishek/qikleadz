<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\VehicleUsage;
use App\Http\Requests\Admin\VehicleUsageRequest;
use App\Repositories\VehicleUsageRepository;

class VehicleUsageApiController extends Controller
{

    protected $repository;
    public function __construct(VehicleUsageRepository $repository)
    {
        $this->repository = $repository;
        // $this->middleware('auth:santum');
    }

    public function index()
    {

        $VehicleUsage = $this->repository->getAll();
        return response()->json([
            'status' => true,
            'data' => $VehicleUsage
        ]);
    }


    public function store(VehicleUsageRequest $request)
    {
        $data = $request->only(['name', 'country_id']);
        $vehicleUsage = $this->repository->create($data);
        return response()->json([
            'status' => true,
            'message' => 'vehicle usages created successfully!'
        ], 201);
    }

    public function show($id)
    {
        $vehicleUsage = $this->repository->getById($id);
        return response()->json([
            'status' => true,
            'data' => $vehicleUsage
        ]);
    }

    public function update(VehicleUsageRequest $request, $id)
    {
        $data = $request->only(['name', 'country_id']);
        $vehicleUsage = $this->repository->update($id, $data);

        return response()->json([
            'status' => true,
            'message' => 'Vehicle Usage updated successfully',
            'data' => $vehicleUsage
        ]);
    }

    public function destroy($id)
    {
        $this->repository->delete($id);

        return response()->json([
            'status' => true,
            'message' => 'Vehicle Usage deleted successfully'
        ]);
    }

}
