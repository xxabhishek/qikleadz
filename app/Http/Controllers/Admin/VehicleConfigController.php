<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\UpdateVehicleConfigRequest;
use App\Http\Requests\Admin\VehicleConfigRequest;
use App\Services\VehicleConfigService;
use App\Services\ModelService;
use App\Services\VariantService;
use App\Services\CountryService;
use App\Services\FuelTypeService;

use Illuminate\Contracts\View\Factory;
use Illuminate\Http\Response;
use Illuminate\View\View;
use App\Http\Controllers\Controller;
use App\Models\VehicleConfig;
use File;
use Illuminate\Support\Str;
class VehicleConfigController extends Controller
{
    /** @var VehicleConfigService */
    protected $vehicleConfigService;

        /** @var ModelService */
    protected $modelService;


    /** @var VariantService */
    protected $variantService;


    /** @var CountryService */
    protected $countryService;

        /** @var FuelTypeService */
    protected $fuelTypeService;



    /**
     * CountryController constructor.
     * @param VehicleConfigService $vehicleConfigService
     */
    public function __construct(
        VehicleConfigService $vehicleConfigService,
                ModelService $modelService,
        VariantService $variantService,
        CountryService $countryService,
        FuelTypeService $fuelTypeService

    ) {
        $this->middleware('auth');
        $this->vehicleConfigService = $vehicleConfigService;
        $this->modelService = $modelService;
        $this->variantService = $variantService ;
        $this->countryService =$countryService ;
        $this->fuelTypeService =$fuelTypeService ;


    }

    /**
     * @param CountryDataTable $dataTable
     * @return mixed
     */
    public function index()
    {
        $vehicleConfigs = $this->vehicleConfigService->getAll();
        $countries=$this->countryService->getAll();

        return view('admin.vehicle-config.index', compact('vehicleConfigs','countries'));
    }

    /**
     * Show the form for creating new Role.
     *
     * @return Response
     */
    public function create()
    {
        $vehicleConfigs = $this->vehicleConfigService->getAll();
        $models =$this->modelService->getAll();
        $variants=$this->variantService->getAll();
        $countries=$this->countryService->getAll();
        $fuelTypes=$this->fuelTypeService->getAll();

        return view('admin.vehicle-config.create', compact('vehicleConfigs','models','variants','countries','fuelTypes'));
    }

    /**
     * @param VehicleConfigRequest $request
     * @return mixed
     */
    public function store(VehicleConfigRequest $request)
    {
        // dd($request);
        //$data = $request->all();
        $data = $request->all();
        // dd($data);
        $result = $this->vehicleConfigService->create($data);
        return redirect()->route('vehicle-config.index')
            ->with('success', 'Vehicle Configration created successfully');
    }


    /**
     * @param VehicleConfig $vehicleConfig
     * @return mixed
     */

    public function edit($id)
    {
        $vehicleConfigs = VehicleConfig::findOrFail($id);
                $models =$this->modelService->getAll();
        $variants=$this->variantService->getAll();
        $countries=$this->countryService->getAll();
        $fuelTypes=$this->fuelTypeService->getAll();

        return view('admin.vehicle-config.edit', compact('vehicleConfigs','models','variants','countries','fuelTypes'));
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
}