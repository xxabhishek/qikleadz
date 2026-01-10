<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\UpdateColorWiseVariantRateRequest;
use App\Http\Requests\Admin\ColorWiseVariantRateRequest;
use App\Services\ColorWiseVariantRateService;
use App\Services\CountryService;
use App\Services\BrandService;
use App\Services\VariantService;
use App\Services\ColorService;
use Illuminate\Contracts\View\Factory;
use Illuminate\Http\Response;
use Illuminate\View\View;
use App\Http\Controllers\Controller;
use App\Models\ColorWiseVariantRate;
use App\Models\Color;
use File;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
class ColorWiseVariantRateController extends Controller
{
    /** @var ColorWiseVariantRateService */
    protected $colorWiseVariantRateService;

    /** @var CountryService */
    protected $countryService;

    /** @var BrandService */
    protected $brandService;

    /** @var VariantService */
    protected $variantService;

    /** @var ColorService */
    protected $colorService;


    /**
     * ColorWiseVariantRateController constructor.
     * @param ColorWiseVariantRateService $colorWiseVariantRateService
     */
    public function __construct(
        ColorWiseVariantRateService $colorWiseVariantRateService,
        CountryService $countryService,
        BrandService $brandService,
        VariantService $variantService,
        ColorService $colorService


    ) {
        $this->middleware('auth');
        $this->colorWiseVariantRateService = $colorWiseVariantRateService;
        $this->countryService = $countryService;
        $this->brandService = $brandService;
        $this->variantService = $variantService;
        $this->colorService = $colorService;

    }

    /**
     * @param ColorWiseVariantRateDataTable $dataTable
     * @return mixed
     */
    public function index()
    {
        $colorWiseRates = $this->colorWiseVariantRateService->getAll();
        return view('admin.color-wise-variant-rate.index', compact('colorWiseRates'));
    }

    /**
     * Show the form for creating new Role.
     *
     * @return Response
     */
    public function create()
    {
        // dd("open");
        $colorWiseRates = $this->colorWiseVariantRateService->getAll();
        $countries = $this->countryService->getAll();
        $brands = $this->brandService->getAll();
        $variants = $this->variantService->getAll();
        $colors = $this->colorService->getAll();


        return view('admin.color-wise-variant-rate.create', compact('colorWiseRates', 'countries', 'brands', 'variants', 'colors'));
    }

    /**
     * @param ColorWiseVariantRateRequest $request
     * @return mixed
     */
    public function store(ColorWiseVariantRateRequest $request)
    {
        // dd($request->all());
        //$data = $request->all();
        $data = $request->all();
        $result = $this->colorWiseVariantRateService->create($data);
        return redirect()->route('color-wise-variant-rate.index')
            ->with('success', 'color-wise-variant-rate created successfully');
    }


    /**
     * @param ColorWiseVariantRate $colorWiseVariantRate
     * @return mixed
     */

    public function edit($id)
    {
        $rate = ColorWiseVariantRate::findOrFail($id);

        // Dropdown data
        $countries = $this->countryService->getAll();
        $brands = $this->brandService->getAll();
        $variants = $this->variantService->getAll();
        $colors = $this->colorService->getAll();

        return view('admin.color-wise-variant-rate.edit', compact(
            'rate',
            'countries',
            'brands',
            'variants',
            'colors'
        ));
    }


    /**
     * @param UpdateColorWiseVariantRateRequest $request
     * @param $id
     * @return mixed
     */
    public function update(UpdateColorWiseVariantRateRequest $request, int $id)
    {
        $data = $request->all();
        // dd($data);
        $this->colorWiseVariantRateService->update($data, $id);
        return redirect()->route('color-wise-variant-rate.index')
            ->with('success', 'color-wise-variant-rate updated successfully');
    }


    public function destroy($id)
    {
        try {
            $this->colorWiseVariantRateService->delete($id);
            return redirect()->route('color-wise-variant-rate.index')
                ->with('success', 'color-wise-variant-rate deleted successfully');
        } catch (\Exception $e) {
            return redirect()->route('color-wise-variant-rate.index')
                ->with('error', $e->getMessage());
        }
    }




}
