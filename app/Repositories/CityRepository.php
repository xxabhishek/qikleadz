<?php

namespace App\Repositories;

use App\Models\City;

class CityRepository
{
    public function getAll()
    {
        return City::with(['country', 'state'])->get();
    }

    public function find($id)
    {
        return City::findOrFail($id);
    }

    public function create(array $data)
    {
        return City::create($data);
    }

    public function update(array $data, $id)
    {
        $city = $this->find($id);
        $city->update($data);
        return $city;
    }

    public function delete($id)
    {
        return City::destroy($id);
    }
}
