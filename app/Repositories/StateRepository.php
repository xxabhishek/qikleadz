<?php

namespace App\Repositories;

use App\Models\State;

class StateRepository
{
    public function getAll()
    {
        return State::with('country')->get();
    }

    public function find($id)
    {
        return State::findOrFail($id);
    }

    public function create(array $data)
    {
        return State::create($data);
    }

    public function update(array $data, $id)
    {
        $state = $this->find($id);
        $state->update($data);
        return $state;
    }

    public function delete($id)
    {
        return State::destroy($id);
    }
}