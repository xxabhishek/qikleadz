<?php

namespace App\Repositories;

use App\Models\Area;

class AreaRepository
{
    protected $model;

    public function __construct(Area $model)
    {
        $this->model = $model;
    }

    public function all()
    {
        return $this->model->with(['country', 'state', 'city'])->get();
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function find($id)
    {
        return $this->model->with(['country', 'state', 'city'])->findOrFail($id);
    }

    public function update($id, array $data)
    {
        $area = $this->find($id);
        $area->update($data);
        return $area;
    }

    public function delete($id)
    {
        $area = $this->find($id);
        return $area->delete();
    }
}
