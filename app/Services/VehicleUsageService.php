<?php

namespace App\Services;

use App\Repositories\VehicleUsageRepository;
use Illuminate\Database\Eloquent\Collection;

/**
 * Class VehicleUsageService
 * @package App\Services
 */
class VehicleUsageService implements ServiceInterface
{
    /** @var VehicleUsageRepository */
    protected $vehicleUsageRepository;

    /**
     * VehicleUsageService constructor.
     * @param VehicleUsageRepository $vehicleUsageRepository
     */
    public function __construct(VehicleUsageRepository $vehicleUsageRepository)
    {
        $this->vehicleUsageRepository = $vehicleUsageRepository;
    }
   
    public function getAll($fields = ["*"])
    {
        return $this->vehicleUsageRepository->getAll($fields);
    }

    /**
     * @inheritDoc
     */
    public function getById($id)
    {
        return $this->vehicleUsageRepository->getById($id);
    }

    
    public function save($data)
    {
        return $this->vehicleUsageRepository->save($data);
    }

    /**
     * @inheritDoc
     */
    public function update($data, $id)
    {
        return $this->vehicleUsageRepository->update($data, $id);
    }

    /**
     * @inheritDoc
     */
    public function delete($id)
    {
        return $this->vehicleUsageRepository->delete($id);
    }
    
    public function create(array $data)
    {
        return $this->vehicleUsageRepository->create($data);
    }
}
