<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\VariantRequest;
use App\Http\Requests\Admin\UpdateVariantRequest;
use App\Models\Variant;
use App\Services\VariantService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class VariantApiController extends Controller
{
    protected $variantService;

    public function __construct(VariantService $variantService)
    {
        $this->variantService = $variantService;
    }

    // GET /api/variants
    public function index()
    {
        $variants = $this->variantService->getAll();
        return response()->json($variants);
    }

    // POST /api/variants
    public function store(VariantRequest $request)
    {
        $data = $request->all();

        if ($request->hasFile('brochure')) {
            $file = $request->file('brochure');

            if ($file->getSize() > 2097152) {
                return response()->json(['error' => 'File size must not exceed 2MB'], 422);
            }

            $filename = date('Y-m-d') . "_" . Str::random(14) . "_" . $file->getClientOriginalName();
            $file->move(public_path('uploads/brochures'), $filename);
            $data['brochure'] = $filename;
        }

        $variant = $this->variantService->create($data);

        return response()->json([
            'message' => 'Variant created successfully',
            'data' => $variant
        ], 201);
    }

    // GET /api/variants/{id}
    public function show($id)
    {
        $variant = $this->variantService->getById($id);

        if (!$variant) {
            return response()->json(['error' => 'Variant not found'], 404);
        }

        // Convert color IDs to names
        $variant->colorNames = [];
        if ($variant->color_id) {
            $colorIds = explode(',', $variant->color_id);
            $variant->colorNames = \App\Models\Color::whereIn('id', $colorIds)->pluck('name')->toArray();
        }

        return response()->json($variant);
    }

    // PUT /api/variants/{id}
    public function update(UpdateVariantRequest $request, $id)
    {
        $data = $request->all();
        $variantEntry = Variant::findOrFail($id);

        if ($request->hasFile('brochure')) {
            $file = $request->file('brochure');

            if ($file->getSize() > 2097152) {
                return response()->json(['error' => 'File size must not exceed 2MB'], 422);
            }

            $oldPath = public_path('uploads/brochures/' . $variantEntry->brochure);
            if ($variantEntry->brochure && File::exists($oldPath)) {
                File::delete($oldPath);
            }

            $filename = date('Y-m-d') . "_" . Str::random(14) . "_" . $file->getClientOriginalName();
            $file->move(public_path('uploads/brochures'), $filename);
            $data['brochure'] = $filename;
        }

        $variant = $this->variantService->update($data, $id);

        return response()->json([
            'message' => 'Variant updated successfully',
            'data' => $variant
        ]);
    }

    // DELETE /api/variants/{id}
    public function destroy($id)
    {
        $this->variantService->delete($id);

        return response()->json(['message' => 'Variant deleted successfully']);
    }
}
