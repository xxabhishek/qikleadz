<?php

namespace App\Repositories;

use App\Models\VehicleUsage;

/**
 * Class VehicleUsageRepository
 * @package App\Repositories
 */
class VehicleUsageRepository implements RepositoryInterface
{
    /** @var VehicleUsage */
    protected $vehicleUsage;

    /**
     * VehicleUsageRepository constructor.
     * @param VehicleUsage $vehicleUsage
     */
    public function __construct(VehicleUsage $vehicleUsage)
    {
        $this->vehicleUsage = $vehicleUsage;
    }

    /**
     * @inheritDoc
     */
    public function getAll($fields = ["*"])
    {
        return $this->vehicleUsage->all($fields);
    }

    /**
     * @inheritDoc
     */
    public function getById($id)
    {
        return $this->vehicleUsage->findOrFail($id);
    }
    

    /**
     * @inheritDoc
     */
    public function save($data)
    {
       $vehicleUsage = new $this->vehicleUsage;
       $vehicleUsage->save($data);

        return $vehicleUsage->fresh();
    }

    /**
     * @inheritDoc
     */
    public function update($data, $id)
    {
        $vehicleUsage = $this->getById($id);
        $vehicleUsage->update($data);

        return $vehicleUsage;
    }

    /**
     * @inheritDoc
     */
    public function delete($id)
    {
        $vehicleUsage = $this->getById($id);
        $vehicleUsage->delete();

        return $vehicleUsage;
    }

    /**
     * @inheritDoc
     */
    public function whereBy(array $attributes, array $fields = ["*"])
    {
        return $this->vehicleUsage->where($attributes)->get($fields);
    }

    /**
     * @inheritDoc
     */
    public function updateBy(array $where, array $attributes)
    {
        return $this->vehicleUsage->where($where)->update($attributes);
    }
    public function create(array $data)
    {
        return VehicleUsage::create($data);
    }
}
