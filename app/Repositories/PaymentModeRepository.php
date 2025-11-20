<?php

namespace App\Repositories;

use App\Models\PaymentMode;

class PaymentModeRepository implements RepositoryInterface
{
    protected $paymentMode;

    public function __construct(PaymentMode $paymentMode)
    {
        $this->paymentMode = $paymentMode;
    }

    public function getAll($fields = ["*"])
    {
        return $this->paymentMode->all($fields);
    }

    public function getById($id)
    {
        return $this->paymentMode->findOrFail($id);
    }

    public function save($data)
    {
        $paymentMode = new $this->paymentMode;
        $paymentMode->fill($data);
        $paymentMode->save();

        return $paymentMode->fresh();
    }

    public function update($data, $id)
    {
        $paymentMode = $this->getById($id);
        $paymentMode->update($data);

        return $paymentMode;
    }

    public function delete($id)
    {
        $paymentMode = $this->getById($id);
        $paymentMode->delete();
        return $paymentMode;
    }

    public function whereBy(array $attributes, array $fields = ["*"])
    {
        return $this->paymentMode->where($attributes)->get($fields);
    }

    public function updateBy(array $where, array $attributes)
    {
        return $this->paymentMode->where($where)->update($attributes);
    }

    public function create(array $data)
    {
        return PaymentMode::create($data);
    }
}
