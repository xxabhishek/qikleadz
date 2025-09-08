<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\VehicleConfigRequest;
use App\Models\Country;
use App\Models\FuelType;
use App\Models\ModelDetail;
use App\Models\Variant;
use App\Services\VehicleConfigService;
use Illuminate\Http\Request;

class VehicleConfigController extends Controller
{
    protected $service;

    public function __construct(VehicleConfigService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $vehicleConfigs = $this->service->getAll();
        return view('admin.vehicle-config.index', compact('vehicleConfigs'));
    }

   public function create()
    {
        $models = ModelDetail::all();
        $variants = Variant::all();
        $fuelTypes = FuelType::all();
        $countries = Country::all();
        return view('admin.vehicle-config.create', compact('models', 'variants', 'fuelTypes', 'countries'));
    }

    public function store(VehicleConfigRequest $request)
    {
        $this->service->create($request->validated());
        return redirect()->route('vehicle_configs.index')->with('success', 'Vehicle Config created successfully');
    }

    public function show($id)
    {
        $vehicleConfig = $this->service->getById($id);
        return view('vehicle_configs.show', compact('vehicleConfig'));
    }

    public function edit($id)
    {
        $vehicleConfig = $this->service->getById($id);
        return view('admin.vehicle-config.edit', compact('vehicleConfig'));
    }

    public function update(VehicleConfigRequest $request, $id)
    {
        $this->service->update($id, $request->validated());
        return redirect()->route('vehicle_configs.index')->with('success', 'Vehicle Config updated successfully');
    }

    public function destroy($id)
    {
        $this->service->delete($id);
        return redirect()->route('vehicle_configs.index')->with('success', 'Vehicle Config deleted successfully');
    }
}
