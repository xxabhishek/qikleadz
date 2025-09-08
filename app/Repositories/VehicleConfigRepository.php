<?php

namespace App\Repositories;

use App\Models\VehicleConfig;

class VehicleConfigRepository
{
    protected $model;

    public function __construct(VehicleConfig $model)
    {
        $this->model = $model;
    }

    public function all()
    {
        return $this->model->with(['model', 'variant', 'fuelType', 'country'])->get();
    }

    public function find($id)
    {
        return $this->model->with(['model', 'variant', 'fuelType', 'country'])->findOrFail($id);
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update($id, array $data)
    {
        $vehicleConfig = $this->find($id);
        $vehicleConfig->update($data);
        return $vehicleConfig;
    }

    public function delete($id)
    {
        $vehicleConfig = $this->find($id);
        return $vehicleConfig->delete();
    }
}
