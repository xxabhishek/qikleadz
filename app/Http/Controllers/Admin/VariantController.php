<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\VariantRequest;
use App\Models\ModelDetail;
use App\Models\Variant;
use App\Repositories\VariantRepository;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class VariantController extends Controller
{
    //

    protected $repository;

    public function __construct(VariantRepository $repository)
    {
        $this->repository = $repository;
        $this->middleware('auth');
    }

    public function index(Request $request)
    {
        $variants = Variant::all(); // Direct Eloquent call
        return view('admin.variants.index', compact('variants'))
            ->with('i', ($request->input('page', 1) - 1) * 5);
    }

    public function create()
    {
        // Assuming a Model model exists; fetch models for the dropdown
        $models = ModelDetail::all(); // Adjust if Model model has a different namespace
        return view('admin.variants.create', compact('models'));
    }

    public function store(VariantRequest $request)
    {
        $data = $request->only(['name', 'model_id']);
        $this->repository->create($data);
        return redirect()->route('variants.index')
            ->with('success', 'Variant created successfully');
    }



    public function edit($id)
    {
        $variant = $this->repository->getById($id);
        $models = ModelDetail::all(); // Fetch models for the dropdown
        return view('admin.variants.edit', compact('variant', 'models'));
    }

    public function update(VariantRequest $request, $id)
    {
        dd($id);
        $data = $request->only(['name', 'model_id']);
        $this->repository->update($id, $data);
        return redirect()->route('variants.index')
            ->with('success', 'Variant updated successfully');
    }

    public function destroy($id)
    {
        $this->repository->delete($id);
        return redirect()->route('variants.index')
            ->with('success', 'Variant deleted successfully');
    }
}
