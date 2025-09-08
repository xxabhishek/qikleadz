<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\UpdateBrandRequest;
use App\Http\Requests\Admin\UpdateModelRequest;
use App\Http\Requests\Admin\BrandRequest;
use App\Models\VehicleUsage;
use App\Models\VehicleSegment;
use App\Models\Country;
use App\Services\BrandService;
use App\Http\Controllers\Controller;
use App\Models\Brand;

class BrandController extends Controller
{
    protected $modelService;

    public function __construct(BrandService $modelService)
    {
        $this->middleware('auth');
        $this->modelService = $modelService;
    }

    public function index()
    {
        dd('ok');
        // $models = $this->modelService->getAll();
        $models = Brand::all();
        return view('admin.brand.index', compact('models'));
    }

    public function create()
    {
        $industryTypes = VehicleUsage::all();
        $vehicleTypes = VehicleSegment::all();
        $countries = Country::all();

        return view('admin.brand.create', compact('industryTypes', 'vehicleTypes', 'countries'));
    }

    public function store(BrandRequest $request)
    {
        $this->modelService->create($request->all());

        return redirect()->route('brand.index')
            ->with('success', 'brand created successfully');
    }

    public function edit($id)
    {
        $modelDetail = Brand::findOrFail($id);
        $industryTypes = VehicleUsage::all();
        $vehicleTypes = VehicleSegment::all();
        $countries = Country::all();

        return view('admin.brand.edit', compact('brand', 'industryTypes', 'vehicleTypes', 'countries'));
    }

    public function update(UpdateBrandRequest $request, int $id)
    {
        $this->modelService->update($request->all(), $id);

        return redirect()->route('brand.index')
            ->with('success', 'brand updated successfully');
    }

    public function destroy($id)
    {
        try {
            $this->modelService->delete($id);
            return redirect()->route('brand.index')
                ->with('success', 'brand deleted successfully');
        } catch (\Exception $e) {
            return redirect()->route('brand.index')
                ->with('error', $e->getMessage());
        }
    }
}
