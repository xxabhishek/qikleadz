<?php

namespace App\Services;

use App\Repositories\CityRepository;

class CityService
{
    protected $cityRepository;

    public function __construct(CityRepository $cityRepository)
    {
        $this->cityRepository = $cityRepository;
    }

    public function getAll()
    {
        return $this->cityRepository->getAll();
    }

    public function find($id)
    {
        return $this->cityRepository->find($id);
    }

    public function create(array $data)
    {
        return $this->cityRepository->create($data);
    }

    public function update(array $data, $id)
    {
        return $this->cityRepository->update($data, $id);
    }

    public function delete($id)
    {
        return $this->cityRepository->delete($id);
    }
}
