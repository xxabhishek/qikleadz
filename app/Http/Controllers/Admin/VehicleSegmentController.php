<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\VehicleSegmentRequest;
use App\Models\Country;
use App\Repositories\VehicleSegmentRepository;
use Illuminate\Http\Request;

class VehicleSegmentController extends Controller
{
    //
    protected $repository;

    public function __construct(VehicleSegmentRepository $repository)
    {
        $this->repository = $repository;
        $this->middleware('auth');
    }

    public function index(Request $request)
    {
        $vehicleTypes = $this->repository->getAll();
        return view('admin.vehicle-segment.index', compact('vehicleTypes'))
            ->with('i', ($request->input('page', 1) - 1) * 5);
    }

    public function create()
    {
        $countries = Country::all();
        return view('admin.vehicle-segment.create', compact('countries'));
    }

    public function edit($id)
    {
        $vehicleType = $this->repository->getById($id);
        $countries = Country::all();
        return view('admin.vehicle-segment.edit', compact('vehicleType', 'countries'));
    }

    public function store(VehicleSegmentRequest $request)
    {
        $data = $request->all();
        $this->repository->create($data);

        return redirect()->route('vehicle-segment.index')
            ->with('success', 'Vehicle type created successfully');
    }

    public function update(Request $request, $id)
    {
        $data = $request->all();
        $this->repository->update($data, $id);

        return redirect()->route('vehicle-segment.index')
            ->with('success', 'Vehicle type updated successfully');
    }

    public function destroy($id)
    {
        $this->repository->delete($id);
        return redirect()->route('vehicle-segment.index')
            ->with('success', 'Vehicle type deleted successfully');
    }
    // public function getByIndustry($industryId)
// {
//     return response()->json(\App\Models\VehicleType::where('industry_type_id', $industryId)->get());
// }
}