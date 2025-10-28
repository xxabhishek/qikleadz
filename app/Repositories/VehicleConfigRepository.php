<?php

namespace App\Repositories;

use App\Models\VehicleConfig;

/**
 * Class VehicleConfigRepository
 * @package App\Repositories
 */
class VehicleConfigRepository implements RepositoryInterface
{
    /** @var VehicleConfig */
    protected $vehicleConfig;

    /**
     * CountryRepository constructor.
     * @param VehicleConfig $vehicleConfig
     */
    public function __construct(VehicleConfig $vehicleConfig)
    {
        $this->vehicleConfig = $vehicleConfig;
    }

    /**
     * @inheritDoc
     */
    public function getAll($fields = ["*"])
    {
        return $this->vehicleConfig->all($fields);
    }

    /**
     * @inheritDoc
     */
    public function getById($id)
    {
        return $this->vehicleConfig->findOrFail($id);
    }
    

    /**
     * @inheritDoc
     */
    public function save($data)
    {
       $vehicleConfig = new $this->vehicleConfig;
       $vehicleConfig->save($data);

        return $vehicleConfig->fresh();
    }

    /**
     * @inheritDoc
     */
    public function update($data, $id)
    {
        $vehicleConfig = $this->getById($id);
        $vehicleConfig->update($data);

        return $vehicleConfig;
    }

    /**
     * @inheritDoc
     */
    public function delete($id)
    {
        $vehicleConfig = $this->getById($id);
        $vehicleConfig->delete();

        return $vehicleConfig;
    }

    /**
     * @inheritDoc
     */
    public function whereBy(array $attributes, array $fields = ["*"])
    {
        return $this->vehicleConfig->where($attributes)->get($fields);
    }

    /**
     * @inheritDoc
     */
    public function updateBy(array $where, array $attributes)
    {
        return $this->vehicleConfig->where($where)->update($attributes);
    }
    public function create(array $data)
    {
        return VehicleConfig::create($data);
    }
}
