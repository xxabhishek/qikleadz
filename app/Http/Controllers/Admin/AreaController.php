<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AreaRequest;
use App\Services\AreaService;

class AreaController extends Controller
{
    protected $areaService;

    public function __construct(AreaService $areaService)
    {
        $this->areaService = $areaService;
    }

    public function index()
    {
        $areas = $this->areaService->getAllAreas();
        return view('admin.area.index', compact('areas'));
    }

    public function create()
    {
        $countries = $this->areaService->getCountries();
        return view('admin.area.create', compact('countries'));
    }

    public function store(AreaRequest $request)
    {
        $this->areaService->createArea($request->validated());
        return redirect()->route('admin.areas.index')->with('success', 'Area created successfully.');
    }

    public function edit($id)
    {
        $area = $this->areaService->getAreaById($id);
        $countries = $this->areaService->getCountries();
        $states = $this->areaService->getStatesByCountry($area->country_id);
        $cities = $this->areaService->getCitiesByState($area->state_id);
        return view('admin.area.edit', compact('area', 'countries', 'states', 'cities'));
    }

    public function update(AreaRequest $request, $id)
    {
        $this->areaService->updateArea($id, $request->validated());
        return redirect()->route('admin.areas.index')->with('success', 'Area updated successfully.');
    }

    public function destroy($id)
    {
        $this->areaService->deleteArea($id);
        return redirect()->route('admin.areas.index')->with('success', 'Area deleted successfully.');
    }
}