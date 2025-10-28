<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\UpdateColorRequest;
use App\Http\Requests\Admin\ColorRequest;
use App\Services\ColorService;
use App\Services\BrandService;
use App\Services\VariantService;
use App\Services\CountryService;
use Illuminate\Contracts\View\Factory;
use Illuminate\Http\Response;
use Illuminate\View\View;
use App\Http\Controllers\Controller;
use App\Models\Color;
use File;
use Illuminate\Support\Str;
class ColorController extends Controller
{
    /** @var ColorService */
    protected $colorService;


    /** @var BrandService */
    protected $brandService;


    /** @var VariantService */
    protected $variantService;


    /** @var CountryService */
    protected $countryService;




    /**
     * CountryController constructor.
     * @param ColorService $colorService
     */
    public function __construct(
        ColorService $colorService,
        BrandService $brandService,
        VariantService $variantService,
        CountryService $countryService
    ) {
        $this->middleware('auth');
        $this->colorService = $colorService;
        $this->brandService = $brandService;
        $this->variantService = $variantService ;
        $this->countryService =$countryService ;
    }

    /**
     * @param ColorDataTable $dataTable
     * @return mixed
     */
    public function index()
    {
        $colors = $this->colorService->getAll();
        return view('admin.color.index', compact('colors'));
    }

    /**
     * Show the form for creating new Role.
     *
     * @return Response
     */
    public function create()
    {
        $colors = $this->colorService->getAll();
        // dd($colors);
        $models =$this->brandService->getAll();
        $variants=$this->variantService->getAll();
        $countries=$this->countryService->getAll();
        return view('admin.color.create', compact('colors','models','variants','countries'));
    }

    /**
     * @param ColorRequest $request
     * @return mixed
     */
    public function store(ColorRequest $request)
    {
        // dd($request);
        //$data = $request->all();
        $data = $request->all();

        

        $result = $this->colorService->create($data);
        return redirect()->route('color.index')
            ->with('success', 'Color created successfully');
    }


    /**
     * @param Color $color
     * @return mixed
     */

    public function edit($id)
    {
        $colors = Color::findOrFail($id);
        return view('admin.color.edit', compact('colors'));
    }


    /**
     * @param UpdateColorRequest $request
     * @param $id
     * @return mixed
     */
    public function update(UpdateColorRequest $request, int $id)
    {
        $data = $request->all();
        $this->colorService->update($data, $id);
        return redirect()->route('color.index')
            ->with('success', 'Color updated successfully');
    }


    public function destroy($id)
    {
        try {
            $this->colorService->delete($id);
            return redirect()->route('color.index')
                ->with('success', 'Color deleted successfully');
        } catch (\Exception $e) {
            return redirect()->route('color.index')
                ->with('error', $e->getMessage());
        }
    }
}