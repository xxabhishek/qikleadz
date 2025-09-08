<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\TransmissionRequest;
use App\Services\TransmissionService;

class TransmissionController extends Controller
{
    protected $service;

    public function __construct(TransmissionService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $transmissions = $this->service->getAll();
        return view('admin.transmission.index', compact('transmissions'));
    }

    public function create()
    {
        return view('admin.transmission.create');
    }

    public function store(TransmissionRequest $request)
    {
        $this->service->create($request->validated());
        return redirect()->route('transmission.index')->with('success', 'Transmission created successfully.');
    }

    public function edit($id)
    {
        $transmission = $this->service->getById($id);
        return view('admin.transmission.edit', compact('transmission'));
    }

    public function update(TransmissionRequest $request, $id)
    {
        $this->service->update($id, $request->validated());
        return redirect()->route('transmission.index')->with('success', 'Transmission updated successfully.');
    }

    public function destroy($id)
    {
        $this->service->delete($id);
        return redirect()->route('transmission.index')->with('success', 'Transmission deleted successfully.');
    }
}