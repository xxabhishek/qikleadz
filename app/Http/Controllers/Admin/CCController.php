<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CCRequest;
use App\Services\CCService;
use Illuminate\Http\Request;

class CCController extends Controller
{
    protected $service;

    public function __construct(CCService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $ccs = $this->service->getAll();
        return view('admin.cc.index', compact('ccs'));
    }

    public function create()
    {
        return view('admin.cc.create');
    }

    public function store(CCRequest $request)
    {
        $this->service->create($request->validated());
        return redirect()->route('cc.index')->with('success', 'CC created successfully.');
    }

    public function edit($id)
    {
        $cc = $this->service->getById($id);
        return view('admin.cc.edit', compact('cc'));
    }

    public function update(CCRequest $request, $id)
    {
        $this->service->update($id, $request->validated());
        return redirect()->route('cc.index')->with('success', 'CC updated successfully.');
    }

    public function destroy($id)
    {
        $this->service->delete($id);
        return redirect()->route('cc.index')->with('success', 'CC deleted successfully.');
    }
}
