<?php

namespace App\Repositories;

use App\Models\Brand;

/**
 * Class CountryRepository
 * @package App\Repositories
 */
class BrandRepository implements RepositoryInterface
{
    /** @var Brand */
    protected $brand;

    /**
     * CountryRepository constructor.
     * @param Brand $brand
     */
    public function __construct(Brand $brand)
    {
        $this->brand = $brand;
    }

    /**
     * @inheritDoc
     */
    public function getAll($fields = ["*"])
    {
        return $this->brand->all($fields);
    }

    /**
     * @inheritDoc
     */
    public function getById($id)
    {
        return $this->brand->findOrFail($id);
    }


    /**
     * @inheritDoc
     */
    public function save($data)
    {
        $brand = new $this->brand;
        $brand->save($data);

        return $brand->fresh();
    }

    /**
     * @inheritDoc
     */
    public function update($data, $id)
    {
        $brand = $this->getById($id);
        $brand->update($data);

        return $brand;
    }

    /**
     * @inheritDoc
     */
    public function delete($id)
    {
        $brand = $this->getById($id);
        $brand->delete();

        return $brand;
    }

    /**
     * @inheritDoc
     */
    public function whereBy(array $attributes, array $fields = ["*"])
    {
        return $this->brand->where($attributes)->get($fields);
    }

    /**
     * @inheritDoc
     */
    public function updateBy(array $where, array $attributes)
    {
        return $this->brand->where($where)->update($attributes);
    }
    // public function create(array $data)
    // {
    //     return Brand::create($data);
    // }

    public function create(array $data)
    {
        // Do you see something like this?
        return Brand::create([
            'name' => $data['name'],
            'vehicle_usage_id' => $data['vehicle_usage_id'],
            'vehicle_segment_id' => $data['vehicle_segment_id'],
            'country_id' => $data['country_id'],
            'oem_id' => $data['oem_id'] ?? null,

        ]);
    }

}