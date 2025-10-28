<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\UpdateOEMRequest;
use App\Http\Requests\Admin\OEMRequest;
use App\Services\OEMService;
use Illuminate\Contracts\View\Factory;
use Illuminate\Http\Response;
use Illuminate\View\View;
use App\Http\Controllers\Controller;
use App\Models\OEM;
use File;
use Illuminate\Support\Str;
class OEMController extends Controller
{
    /** @var OEMService */
    protected $oemService;

    /**
     * OEMController constructor.
     * @param OEMService $oemService
     */
    public function __construct(
        OEMService $oemService
    ) {
        $this->middleware('auth');
        $this->oemService = $oemService;
    }

    /**
     * @param OEMDataTable $dataTable
     * @return mixed
     */
    public function index()
    {
        $oems = $this->oemService->getAll();
        return view('admin.oem.index', compact('oems'));
    }

    /**
     * Show the form for creating new Role.
     *
     * @return Response
     */
    public function create()
    {
        $oems = $this->oemService->getAll();
        return view('admin.oem.create', compact('oems'));
    }

    /**
     * @param OEMRequest $request
     * @return mixed
     */
    public function store(OEMRequest $request)
    {
        // dd($request);
        //$data = $request->all();
        $data = $request->all();
        $result = $this->oemService->create($data);
        return redirect()->route('oem.index')
            ->with('success', 'OEM created successfully');
    }


    /**
     * @param OEM $oem
     * @return mixed
     */

    public function edit($id)
    {
        $oems = OEM::findOrFail($id);
        return view('admin.oem.edit', compact('oems'));
    }


    /**
     * @param UpdateOEMRequest $request
     * @param $id
     * @return mixed
     */
    public function update(UpdateOEMRequest $request, int $id)
    {
        $data = $request->all();

        $this->oemService->update($data, $id);
        return redirect()->route('oem.index')
            ->with('success', 'OEM updated successfully');
    }


    public function destroy($id)
    {
        try {
            $this->oemService->delete($id);
            return redirect()->route('oem.index')
                ->with('success', 'OEM deleted successfully');
        } catch (\Exception $e) {
            return redirect()->route('oem.index')
                ->with('error', $e->getMessage());
        }
    }
}