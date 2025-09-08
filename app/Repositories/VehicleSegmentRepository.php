<?php

namespace App\Repositories;

use App\Models\VehicleSegment;

class VehicleSegmentRepository
{
    protected $model;

    public function __construct(VehicleSegment $model)
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
        $vehicleType = $this->find($id);
        $vehicleType->update($data);
        return $vehicleType;
    }

    public function delete($id)
    {
        $vehicleType = $this->find($id);
        $vehicleType->delete();
        return true;
    }
}
