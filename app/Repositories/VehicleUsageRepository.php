<?php

namespace App\Repositories;

use App\Models\VehicleUsage;

class VehicleUsageRepository
{
    protected $model;

    public function __construct(VehicleUsage $model)
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
        $industryType = $this->find($id);
        $industryType->update($data);
        return $industryType;
    }

    public function delete($id)
    {
        $industryType = $this->find($id);
        $industryType->delete();
        return true;
    }
}
