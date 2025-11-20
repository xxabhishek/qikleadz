<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PaymentModeRequest;
use App\Http\Requests\Admin\UpdatePaymentModeRequest;
use App\Services\PaymentModeService;

class PaymentModeController extends Controller
{
    protected $paymentModeService;

    public function __construct(PaymentModeService $paymentModeService)
    {
        $this->paymentModeService = $paymentModeService;
    }

    public function index()
    {
        $paymentModes = $this->paymentModeService->getAll();
        return view('admin.payment_mode.index', compact('paymentModes'));
    }
 public function create()
    {
        return view('admin.payment_mode.create');
    }
    public function store(PaymentModeRequest $request)
    {
        $this->paymentModeService->save($request->validated());
       return redirect()->route('payment-mode.index')
            ->with('success', 'Payment Mode created successfully');
    }

    public function edit($id)
    {
        $paymentMode = $this->paymentModeService->getById($id);
        return view('admin.payment_mode.edit', compact('paymentMode'));
    }

    public function update(UpdatePaymentModeRequest $request, $id)
    {
        $this->paymentModeService->update($request->validated(), $id);
        return redirect()->route('payment-mode.index')->with('success', 'Payment mode updated!');
    }

    public function destroy($id)
    {
        $this->paymentModeService->delete($id);
        return redirect()->back()->with('success', 'Payment mode deleted!');
    }
}
