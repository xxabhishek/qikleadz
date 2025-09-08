<?php

namespace App\Repositories;

use App\Models\FuelType;

class FuelTypeRepository
{
    protected $model;

    public function __construct(FuelType $model)
    {
        $this->model = $model;
    }

    public function all()
    {
        return $this->model->orderBy('id', 'desc')->get();
    }

    public function find($id)
    {
        return $this->model->findOrFail($id);
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update($id, array $data)
    {
        $fuelType = $this->find($id);
        $fuelType->update($data);
        return $fuelType;
    }

    public function delete($id)
    {
        $fuelType = $this->find($id);
        $fuelType->delete();
        return true;
    }
}
 