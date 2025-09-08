<?php

namespace App\Services;

use App\Repositories\StateRepository;

class StateService
{
    protected $stateRepository;

    public function __construct(StateRepository $stateRepository)
    {
        $this->stateRepository = $stateRepository;
    }

    public function getAll()
    {
        return $this->stateRepository->getAll();
    }

    public function find($id)
    {
        return $this->stateRepository->find($id);
    }

    public function create(array $data)
    {
        return $this->stateRepository->create($data);
    }

    public function update(array $data, $id)
    {
        return $this->stateRepository->update($data, $id);
    }

    public function delete($id)
    {
        return $this->stateRepository->delete($id);
    }
}
