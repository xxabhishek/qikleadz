<?php

namespace App\Repositories;

use App\Models\VehicleSegment;

/**
 * Class VehicleSegmentRepository
 * @package App\Repositories
 */
class VehicleSegmentRepository implements RepositoryInterface
{
    /** @var VehicleSegment */
    protected $vehicleSegment;

    /**
     * VehicleSegmentRepository constructor.
     * @param VehicleSegment $vehicleSegment
     */
    public function __construct(VehicleSegment $vehicleSegment)
    {
        $this->vehicleSegment = $vehicleSegment;
    }

    /**
     * @inheritDoc
     */
    public function getAll($fields = ["*"])
    {
        return $this->vehicleSegment->all($fields);
    }

    /**
     * @inheritDoc
     */
    public function getById($id)
    {
        return $this->vehicleSegment->findOrFail($id);
    }
    

    /**
     * @inheritDoc
     */
    public function save($data)
    {
       $vehicleSegment = new $this->vehicleSegment;
       $vehicleSegment->save($data);

        return $vehicleSegment->fresh();
    }

    /**
     * @inheritDoc
     */
    public function update($data, $id)
    {
        $vehicleSegment = $this->getById($id);
        $vehicleSegment->update($data);

        return $vehicleSegment;
    }

    /**
     * @inheritDoc
     */
    public function delete($id)
    {
        $vehicleSegment = $this->getById($id);
        $vehicleSegment->delete();

        return $vehicleSegment;
    }

    /**
     * @inheritDoc
     */
    public function whereBy(array $attributes, array $fields = ["*"])
    {
        return $this->vehicleSegment->where($attributes)->get($fields);
    }

    /**
     * @inheritDoc
     */
    public function updateBy(array $where, array $attributes)
    {
        return $this->vehicleSegment->where($where)->update($attributes);
    }
    public function create(array $data)
    {
        return VehicleSegment::create($data);
    }
}
