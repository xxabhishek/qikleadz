<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Repositories\FuelTypeRepository;
use App\Http\Requests\Admin\FuelTypeRequest;
use Illuminate\Http\Request;

class FuelTypeController extends Controller
{
    //

    protected $repository;

    public function __construct(FuelTypeRepository $repository)
    {
        $this->repository = $repository;
        $this->middleware('auth');
    }

    public function index(Request $request)
    {
        $fuelTypes = $this->repository->all();
        return view('admin.fuel-types.index', compact('fuelTypes'))
            ->with('i', ($request->input('page', 1) - 1) * 5);
    }

    public function create()
    {
        return view('admin.fuel-types.create');
    }

    public function store(FuelTypeRequest $request)
    {
        $data = $request->only(['name']);
        $this->repository->create($data);
        return redirect()->route('fuel-types.index')
            ->with('success', 'Fuel type created successfully');
    }

   

    public function edit($id)
    {
        $fuelType = $this->repository->find($id);
        return view('admin.fuel-types.edit', compact('fuelType'));
    }

    public function update(FuelTypeRequest $request, $id)
    {
        $data = $request->only(['name']);
        $this->repository->update($id, $data);
        return redirect()->route('fuel-types.index')
            ->with('success', 'Fuel type updated successfully');
    }

    public function destroy($id)
    {
        $this->repository->delete($id);
        return redirect()->route('fuel-types.index')
            ->with('success', 'Fuel type deleted successfully');
    }
}
