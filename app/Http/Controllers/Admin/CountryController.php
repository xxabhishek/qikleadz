<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\UpdateCountryRequest;
use App\Http\Requests\Admin\CountryRequest;
use App\Services\CountryService;
use Illuminate\Contracts\View\Factory;
use Illuminate\Http\Response;
use Illuminate\View\View;
use App\Http\Controllers\Controller;
use App\Models\Country;
use App\Models\State;
use App\Models\Brand;
use App\Models\Variant;
use File;
use Illuminate\Support\Str;
class CountryController extends Controller
{
    /** @var CountryService */
    protected $countryService;

    /**
     * CountryController constructor.
     * @param CountryService $countryService
     */
    public function __construct(
        CountryService $countryService
    ) {
        $this->middleware('auth');
        $this->countryService = $countryService;
    }

    /**
     * @param CountryDataTable $dataTable
     * @return mixed
     */
    public function index()
    {
        $countries = $this->countryService->getAll();
        return view('admin.country.index', compact('countries'));
    }

    /**
     * Show the form for creating new Role.
     *
     * @return Response
     */
    public function create()
    {
        $countries = $this->countryService->getAll();
        return view('admin.country.create', compact('countries'));
    }

    /**
     * @param CountryRequest $request
     * @return mixed
     */
    public function store(CountryRequest $request)
    {
        // dd($request);
        //$data = $request->all();
        $data = $request->all();
        if ($request->hasFile('flag')) {
            $file = $request->file('flag');
            $imagename = date('Y-m-d') . "_" . Str::random(14) . "_" . $file->getClientOriginalName();
            $file->move(public_path('/uploads/flags'), $imagename);
            $data['flag'] = $imagename;
        }
        $result = $this->countryService->create($data);
        return redirect()->route('country.index')
            ->with('success', 'Country created successfully');
    }


    /**
     * @param Country $country
     * @return mixed
     */

    public function edit($id)
    {
        $countries = Country::findOrFail($id);
        return view('admin.country.edit', compact('countries'));
    }


    /**
     * @param UpdateCountryRequest $request
     * @param $id
     * @return mixed
     */
    public function update(UpdateCountryRequest $request, int $id)
    {
        $data = $request->all();
        if ($request->hasFile('flag1')) {
            $filepath = public_path('/uploads/flags/' . $request->flag);

            if (File::exists($filepath)) {
                File::delete($filepath);
            }
            $file = $request->file('flag1');
            $imagename = date('Y-m-d') . "_" . Str::random(14) . "_" . $file->getClientOriginalName();
            $file->move(public_path('/uploads/flags'), $imagename);
            $data['flag'] = $imagename;
        }
        $this->countryService->update($data, $id);
        return redirect()->route('country.index')
            ->with('success', 'Country updated successfully');
    }


    public function destroy($id)
    {
        try {
            $this->countryService->delete($id);
            return redirect()->route('country.index')
                ->with('success', 'Country deleted successfully');
        } catch (\Exception $e) {
            return redirect()->route('country.index')
                ->with('error', $e->getMessage());
        }
    }


        public function getByCountry($country_id)
    {
        // dd("ok");
         $states=State::
            where('country_id', '=', $country_id)

            ->pluck('name','id')
            ->all();
            // dd($states);
            return json_encode($states);
    }


            public function getByCountrySelectBrand($country_id)
    {
        // dd("ok");
         $brands=Brand::where('country_id', '=', $country_id)

            ->pluck('name','id')
            ->all();
            // dd($brands);
            return json_encode($brands);
    }



 public function getByBrandSelectVariant($brand_id)
    {
        // dd("ok");
         $variants=Variant::where('brand_id', '=', $brand_id)

            ->pluck('name','id')
            ->all();
            // dd($variants);
            return json_encode($variants);
    }


}
