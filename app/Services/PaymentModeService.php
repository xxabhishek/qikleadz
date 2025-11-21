<?php

namespace App\Services;

use App\Repositories\PaymentModeRepository;

class PaymentModeService implements ServiceInterface
{
    protected $paymentModeRepository;

    public function __construct(PaymentModeRepository $paymentModeRepository)
    {
        $this->paymentModeRepository = $paymentModeRepository;
    }

    public function getAll($fields = ["*"])
    {
        return $this->paymentModeRepository->getAll($fields);
    }

    public function getById($id)
    {
        return $this->paymentModeRepository->getById($id);
    }

    public function save($data)
    {
        return $this->paymentModeRepository->save($data);
    }

    public function create(array $data)
    {
        return $this->paymentModeRepository->create($data);
    }

    public function update($data, $id)
    {
        return $this->paymentModeRepository->update($data, $id);
    }


    public function delete($id)
    {
        return $this->paymentModeRepository->delete($id);
    }
}