<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CityRequest;
use App\Http\Requests\Admin\UpdateCityRequest;
use App\Services\CityService;
use App\Models\Country;
use App\Models\State;

class CityController extends Controller
{
    protected $cityService;

    public function __construct(CityService $cityService)
    {
        $this->middleware('auth');
        $this->cityService = $cityService;
    }

    public function index()
    {
        $cities = $this->cityService->getAll();
        return view('admin.city.index', compact('cities'));
    }

    public function create()
    {
        $countries = Country::all();
        $states = State::all();
        return view('admin.city.create', compact('countries', 'states'));
    }

    public function store(CityRequest $request)
    {
        // dd($request->all());
        $this->cityService->create($request->all());
        return redirect()->route('city.index')->with('success', 'City created successfully');
    }

    public function edit($id)
    {
        $city = $this->cityService->find($id);
        $countries = Country::all();
        $states = State::all();
        return view('admin.city.edit', compact('city', 'countries', 'states'));
    }

    public function update(UpdateCityRequest $request, $id)
    {
        // dd()
        $this->cityService->update($request->all(), $id);
        return redirect()->route('city.index')->with('success', 'City updated successfully');
    }

    public function destroy($id)
    {
        $this->cityService->delete($id);
        return redirect()->route('city.index')->with('success', 'City deleted successfully');
    }
}
