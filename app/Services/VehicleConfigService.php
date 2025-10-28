<?php

namespace App\Services;

use App\Repositories\VehicleConfigRepository;
use Illuminate\Database\Eloquent\Collection;

/**
 * Class VehicleConfigService
 * @package App\Services
 */
class VehicleConfigService implements ServiceInterface
{
    /** @var VehicleConfigRepository */
    protected $vehicleConfigRepository;

    /**
     * CountryService constructor.
     * @param VehicleConfigRepository $vehicleConfigRepository
     */
    public function __construct(VehicleConfigRepository $vehicleConfigRepository)
    {
        $this->vehicleConfigRepository = $vehicleConfigRepository;
    }
   
    public function getAll($fields = ["*"])
    {
        return $this->vehicleConfigRepository->getAll($fields);
    }

    /**
     * @inheritDoc
     */
    public function getById($id)
    {
        return $this->vehicleConfigRepository->getById($id);
    }

    
    public function save($data)
    {
        return $this->vehicleConfigRepository->save($data);
    }

    /**
     * @inheritDoc
     */
    public function update($data, $id)
    {
        return $this->vehicleConfigRepository->update($data, $id);
    }

    /**
     * @inheritDoc
     */
    public function delete($id)
    {
        return $this->vehicleConfigRepository->delete($id);
    }
    
    public function create(array $data)
    {
        return $this->vehicleConfigRepository->create($data);
    }
}
