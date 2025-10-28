<?php

namespace App\Services;

use App\Repositories\AreaRepository;
use App\Models\Country;
use App\Models\State;
use App\Models\City;

class AreaService
{
    protected $repository;

    public function __construct(AreaRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getAllAreas()
    {
        return $this->repository->all();
    }

    public function createArea(array $data)
    {
        return $this->repository->create($data);
    }

    public function getAreaById($id)
    {
        return $this->repository->find($id);
    }

    public function updateArea($id, array $data)
    {
        return $this->repository->update($id, $data);
    }

    public function deleteArea($id)
    {
        return $this->repository->delete($id);
    }

    public function getCountries()
    {
        return Country::all();
    }

    public function getStatesByCountry($countryId)
    {
        return State::where('country_id', $countryId)->get();
    }

    public function getCitiesByState($stateId)
    {
        return City::where('state_id', $stateId)->get();
    }
}