<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\UpdateBrandRequest;
use App\Http\Requests\Admin\BrandRequest;
use App\Models\VehicleUsage;
use App\Models\VehicleSegment;
use App\Models\Country;
use App\Services\BrandService;
use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\OEM;

class BrandController extends Controller
{
    protected $brandService;

    public function __construct(BrandService $brandService)
    {
        $this->middleware('auth');
        $this->brandService = $brandService;
    }

    public function index()
    {
        // $models = $this->brandService->getAll();
        // return view('admin.brand.index', compact('models'));

        $models = $this->brandService->getAll(['*'], ['oem']);
        return view('admin.brand.index', compact('models'));

    }

    public function create()
    {
        $industryTypes = VehicleUsage::all();
        $vehicleTypes = VehicleSegment::all();
        $countries = Country::all();
        $oems = OEM::all();

        return view('admin.brand.create', compact('industryTypes', 'vehicleTypes', 'countries', 'oems'));
    }

    public function store(BrandRequest $request)
    {
        // dd($request->all());
        $this->brandService->create($request->all());

        return redirect()->route('brand.index')
            ->with('success', 'Brand created successfully');
    }

    public function edit($id)
    {
        $modelDetail = Brand::findOrFail($id);
        $industryTypes = VehicleUsage::all();
        $vehicleTypes = VehicleSegment::all();
        $countries = Country::all();
        $oems = Oem::all();

        return view('admin.brand.edit', compact('modelDetail', 'industryTypes', 'vehicleTypes', 'countries', 'oems'));
    }

    public function update(UpdateBrandRequest $request, int $id)
    {
        $this->brandService->update($request->all(), $id);

        return redirect()->route('brand.index')
            ->with('success', 'Model updated successfully');
    }

    public function destroy($id)
    {
        try {
            $this->brandService->delete($id);
            return redirect()->route('brand.index')
                ->with('success', 'Model deleted successfully');
        } catch (\Exception $e) {
            return redirect()->route('brand.index')
                ->with('error', $e->getMessage());
        }
    }
}
