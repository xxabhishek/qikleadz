<?php

namespace App\Services;

use App\Repositories\FuelTypeRepository;
use Illuminate\Database\Eloquent\Collection;

/**
 * Class CountryService
 * @package App\Services
 */
class FuelTypeService implements ServiceInterface
{
    /** @var FuelTypeService */
    protected $fuelTypeService;

    /**
     * CountryService constructor.
     * @param FuelTypeService $fuelTypeService
     */
    public function __construct(FuelTypeService $fuelTypeService)
    {
        $this->fuelTypeService = $fuelTypeService;
    }
   
    public function getAll($fields = ["*"])
    {
        return $this->fuelTypeService->getAll($fields);
    }

    /**
     * @inheritDoc
     */
    public function getById($id)
    {
        return $this->fuelTypeService->getById($id);
    }

    
    public function save($data)
    {
        return $this->fuelTypeService->save($data);
    }

    /**
     * @inheritDoc
     */
    public function update($data, $id)
    {
        return $this->fuelTypeService->update($data, $id);
    }

    /**
     * @inheritDoc
     */
    public function delete($id)
    {
        return $this->fuelTypeService->delete($id);
    }
    
    public function create(array $data)
    {
        return $this->fuelTypeService->create($data);
    }
}
