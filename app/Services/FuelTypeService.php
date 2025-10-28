<?php
namespace App\Services;

use App\Repositories\FuelTypeRepository;

class FuelTypeService implements ServiceInterface
{
    /** @var FuelTypeRepository */
    protected $fuelTypeRepository;

    /**
     * FuelTypeService constructor.
     * @param FuelTypeRepository $fuelTypeRepository
     */
    public function __construct(FuelTypeRepository $fuelTypeRepository)
    {
        $this->fuelTypeRepository = $fuelTypeRepository;
    }

    public function getAll($fields = ["*"])
    {
        return $this->fuelTypeRepository->getAll($fields);
    }

    public function getById($id)
    {
        return $this->fuelTypeRepository->getById($id);
    }

    public function save($data)
    {
        return $this->fuelTypeRepository->save($data);
    }

    public function update($data, $id)
    {
        return $this->fuelTypeRepository->update($data, $id);
    }

    public function delete($id)
    {
        return $this->fuelTypeRepository->delete($id);
    }

    public function create(array $data)
    {
        return $this->fuelTypeRepository->create($data);
    }
}
