<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\FuelTypeService;
use App\Http\Requests\Admin\FuelTypeRequest;
use Illuminate\Http\Request;

class FuelTypeController extends Controller
{
    //

    /**  @var FuelTypeService  */
    protected $fuelTypeService;

            /**
     * VariantController constructor.
     * @param FuelTypeService $fuelTypeService
     */



    public function __construct(FuelTypeService $fuelTypeService)
    {
        $this->fuelTypeService = $fuelTypeService;
        $this->middleware('auth');
    }

    public function index(Request $request)
    {
        $fuelTypes = $this->fuelTypeService->getAll();
        return view('admin.fuel-types.index', compact('fuelTypes'))
            ->with('i', ($request->input('page', 1) - 1) * 5);
    }

    public function create()
    {
        return view('admin.fuel-types.create');
    }

    public function store(FuelTypeRequest $request)
    {
        $data = $request->all();
        // dd($data);
        $this->fuelTypeService->create($data);
        return redirect()->route('fuel-types.index')
            ->with('success', 'Fuel type created successfully');
    }

   

    public function edit($id)
    {
        $fuelType = $this->fuelTypeService->getById($id);
        return view('admin.fuel-types.edit', compact('fuelType'));
    }

    public function update(FuelTypeRequest $request, $id)
    {
        $data = $request->only(['name']);
        $this->fuelTypeService->update($data, $id);
        return redirect()->route('fuel-types.index')
            ->with('success', 'Fuel type updated successfully');
    }

    public function destroy($id)
    {
        $this->fuelTypeService->delete($id);
        return redirect()->route('fuel-types.index')
            ->with('success', 'Fuel type deleted successfully');
    }
}
