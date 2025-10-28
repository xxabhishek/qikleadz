<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CCRequest;
use App\Services\CCService;
use Illuminate\Http\Request;

class CCApiController extends Controller
{
    protected $service;

    public function __construct(CCService $service)
    {
        $this->service = $service;
    }

    // GET /api/ccs
    public function index()
    {
        $ccs = $this->service->getAll();
        return response()->json($ccs, 200);
    }

    // POST /api/ccs
    public function store(CCRequest $request)
    {
        $cc = $this->service->create($request->validated());

        return response()->json([
            'message' => 'CC created successfully',
            'data' => $cc
        ], 201);
    }

    // GET /api/ccs/{id}
    public function show($id)
    {
        $cc = $this->service->getById($id);

        if (!$cc) {
            return response()->json(['message' => 'CC not found'], 404);
        }

        return response()->json($cc, 200);
    }

    // PUT /api/ccs/{id}
    public function update(CCRequest $request, $id)
    {
        $updated = $this->service->update($id, $request->validated());

        if (!$updated) {
            return response()->json(['message' => 'CC not found'], 404);
        }

        return response()->json(['message' => 'CC updated successfully'], 200);
    }

    // DELETE /api/ccs/{id}
    public function destroy($id)
    {
        $deleted = $this->service->delete($id);

        if (!$deleted) {
            return response()->json(['message' => 'CC not found'], 404);
        }

        return response()->json(['message' => 'CC deleted successfully'], 200);
    }
}