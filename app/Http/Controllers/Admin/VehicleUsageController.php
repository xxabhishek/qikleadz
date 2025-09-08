<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\VehicleUsageRequest;
use App\Models\Country;
use App\Models\VehicleUsage;
use App\Repositories\IndustryTypeRepository;
use App\Repositories\VehicleUsageRepository;
use Illuminate\Http\Request;

class VehicleUsageController extends Controller
{
    //
    protected $repository;

    public function __construct(VehicleUsageRepository $repository)
    {
        $this->repository = $repository;
        $this->middleware('auth');
    }

    public function index(Request $request)
    {
        $industryTypes = $this->repository->all();
        return view('admin.vehicle-usage.index', compact('industryTypes'))
            ->with('i', ($request->input('page', 1) - 1) * 5);
    }

    public function create()
    {
        $countries = Country::all();
        return view('admin.vehicle-usage.create', compact('countries'));
    }

    public function edit($id)
    {
        $industryType = $this->repository->find($id);
        $countries = Country::all();
        return view('admin.vehicle-usage.edit', compact('industryType', 'countries'));
    }

    public function store(VehicleUsageRequest $request)
    {
        $data = $request->only(['name', 'country_id']);
        $this->repository->create($data);

        return redirect()->route('vehicle-usage.index')
            ->with('success', 'Vehical Usage created successfully');
    }

    public function update(VehicleUsageRequest $request, $id)
    {
        $data = $request->only(['name', 'country_id']);
        $this->repository->update($id, $data);

        return redirect()->route('vehicle-usage.index')
            ->with('success', 'Vehical Usagee updated successfully');
    }

    public function destroy($id)
    {
        $this->repository->delete($id);
        return redirect()->route('vehicle-usage.index')
            ->with('success', 'Vehical Usage deleted successfully');
    }

    // public function getByVehicle($vehicleId)
// {
//     return response()->json(\App\Models\IndustryType::where('vehicle_type_id', $vehicleId)->get());
// }



}
