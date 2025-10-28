<?php

namespace App\Services;

use App\Repositories\VehicleSegmentRepository;
use Illuminate\Database\Eloquent\Collection;

/**
 * Class VehicleVehicleSegmentService
 * @package App\Services
 */
class VehicleSegmentService implements ServiceInterface
{
    /** @var VehicleSegmentRepository */
    protected $vehicleSegmentRepository;

    /**
     * CountryService constructor.
     * @param VehicleSegmentRepository $vehicleSegmentRepository
     */
    public function __construct(VehicleSegmentRepository $vehicleSegmentRepository)
    {
        $this->vehicleSegmentRepository = $vehicleSegmentRepository;
    }
   
    public function getAll($fields = ["*"])
    {
        return $this->vehicleSegmentRepository->getAll($fields);
    }

    /**
     * @inheritDoc
     */
    public function getById($id)
    {
        return $this->vehicleSegmentRepository->getById($id);
    }

    
    public function save($data)
    {
        return $this->vehicleSegmentRepository->save($data);
    }

    /**
     * @inheritDoc
     */
    public function update($data, $id)
    {
        return $this->vehicleSegmentRepository->update($data, $id);
    }

    /**
     * @inheritDoc
     */
    public function delete($id)
    {
        return $this->vehicleSegmentRepository->delete($id);
    }
    
    public function create(array $data)
    {
        return $this->vehicleSegmentRepository->create($data);
    }
}
