<?php

namespace App\Repositories;

use App\Models\FuelType;

/**
 * Class FuelTypeRepository
 * @package App\Repositories
 */
class FuelTypeRepository implements RepositoryInterface
{
    /** @var FuelType */
    protected $fuelType;

    /**
     * FuelTypeRepository constructor.
     * @param FuelType $fuelType
     */
    public function __construct(FuelType $fuelType)
    {
        $this->fuelType = $fuelType;
    }

    /**
     * @inheritDoc
     */
    public function getAll($fields = ["*"])
    {
        return $this->fuelType->all($fields);
    }

    /**
     * @inheritDoc
     */
    public function getById($id)
    {
        return $this->fuelType->findOrFail($id);
    }
    

    /**
     * @inheritDoc
     */
    public function save($data)
    {
       $fuelType = new $this->fuelType;
       $fuelType->save($data);

        return $fuelType->fresh();
    }

    /**
     * @inheritDoc
     */
    public function update($data, $id)
    {
        $fuelType = $this->getById($id);
        $fuelType->update($data);

        return $fuelType;
    }

    /**
     * @inheritDoc
     */
    public function delete($id)
    {
        $fuelType = $this->getById($id);
        $fuelType->delete();

        return $fuelType;
    }

    /**
     * @inheritDoc
     */
    public function whereBy(array $attributes, array $fields = ["*"])
    {
        return $this->fuelType->where($attributes)->get($fields);
    }

    /**
     * @inheritDoc
     */
    public function updateBy(array $where, array $attributes)
    {
        return $this->fuelType->where($where)->update($attributes);
    }
    public function create(array $data)
    {
        return FuelType::create($data);
    }
}
