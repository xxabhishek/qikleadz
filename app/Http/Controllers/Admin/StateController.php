<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StateRequest;
use App\Http\Requests\Admin\UpdateStateRequest;
use App\Services\StateService;
use App\Models\Country;

class StateController extends Controller
{
    protected $stateService;

    public function __construct(StateService $stateService)
    {
        $this->middleware('auth');
        $this->stateService = $stateService;
    }

    public function index()
    {
        $states = $this->stateService->getAll();
        return view('admin.state.index', compact('states'));
    }

    public function create()
    {
        $countries = Country::all();
        return view('admin.state.create', compact('countries'));
    }

    public function store(StateRequest $request)
    {
        // dd($request->all());
        $this->stateService->create($request->all());
        return redirect()->route('state.index')->with('success', 'State created successfully');
    }

    public function edit($id)
    {
        $state = $this->stateService->find($id);
        $countries = Country::all();
        return view('admin.state.edit', compact('state', 'countries'));
    }

    public function update(UpdateStateRequest $request, $id)
    {
        $this->stateService->update($request->all(), $id);
        return redirect()->route('state.index')->with('success', 'State updated successfully');
    }

    public function destroy($id)
    {
        $this->stateService->delete($id);
        return redirect()->route('state.index')->with('success', 'State deleted successfully');
    }
}
