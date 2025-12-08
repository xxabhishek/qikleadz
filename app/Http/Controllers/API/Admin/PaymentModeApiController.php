<?php


namespace App\Http\Controllers\API\Admin;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PaymentModeRequest;
use App\Http\Requests\Admin\UpdatePaymentModeRequest;
use App\Services\PaymentModeService;
use App\Services\CountryService;
use Illuminate\Http\JsonResponse;

class PaymentModeApiController extends Controller
{
    protected $paymentModeService;
    protected $countryService;

    public function __construct(
        PaymentModeService $paymentModeService,
        CountryService $countryService
    ) {
        $this->paymentModeService = $paymentModeService;
        $this->countryService = $countryService;
    }

    /**
     * Get all payment modes
     */
    public function index(): JsonResponse
    {
        $paymentModes = $this->paymentModeService->getAll();

        return response()->json([
            'status' => true,
            'data' => $paymentModes
        ], 200);
    }

    /**
     * Get countries list for dropdown
     */
    public function create(): JsonResponse
    {
        $countries = $this->countryService->getAll();

        return response()->json([
            'status' => true,
            'data' => $countries
        ], 200);
    }

    /**
     * Store new payment mode
     */
    public function store(PaymentModeRequest $request): JsonResponse
    {
        $paymentMode = $this->paymentModeService->save($request->validated());

        return response()->json([
            'status' => true,
            'message' => 'Payment mode created successfully.',
            'data' => $paymentMode
        ], 201);
    }

    /**
     * Get payment mode by ID
     */
    public function edit($id): JsonResponse
    {
        $paymentMode = $this->paymentModeService->getById($id);
        $countries = $this->countryService->getAll();

        return response()->json([
            'status' => true,
            'data' => [
                'payment_mode' => $paymentMode,
                'countries' => $countries
            ]
        ], 200);
    }

    /**
     * Update payment mode
     */
    public function update(UpdatePaymentModeRequest $request, $id): JsonResponse
    {
        $updated = $this->paymentModeService->update($request->validated(), $id);

        return response()->json([
            'status' => true,
            'message' => 'Payment mode updated successfully.',
            'data' => $updated
        ], 200);
    }

    /**
     * Delete payment mode
     */
    public function destroy($id): JsonResponse
    {
        $this->paymentModeService->delete($id);

        return response()->json([
            'status' => true,
            'message' => 'Payment mode deleted successfully.'
        ], 200);
    }
}
