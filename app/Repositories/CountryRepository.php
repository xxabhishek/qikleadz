<?php

namespace App\Repositories;

use App\Models\Country;

/**
 * Class CountryRepository
 * @package App\Repositories
 */
class CountryRepository implements RepositoryInterface
{
    /** @var Country */
    protected $country;

    /**
     * CountryRepository constructor.
     * @param Country $country
     */
    public function __construct(Country $country)
    {
        $this->country = $country;
    }

    /**
     * @inheritDoc
     */
    public function getAll($fields = ["*"])
    {
        return $this->country->all($fields);
    }

    /**
     * @inheritDoc
     */
    public function getById($id)
    {
        return $this->country->findOrFail($id);
    }
    

    /**
     * @inheritDoc
     */
    public function save($data)
    {
       $country = new $this->country;
       $country->save($data);

        return $country->fresh();
    }

    /**
     * @inheritDoc
     */
    public function update($data, $id)
    {
        $country = $this->getById($id);
        $country->update($data);

        return $country;
    }

    /**
     * @inheritDoc
     */
    public function delete($id)
    {
        $country = $this->getById($id);
        $country->delete();

        return $country;
    }

    /**
     * @inheritDoc
     */
    public function whereBy(array $attributes, array $fields = ["*"])
    {
        return $this->country->where($attributes)->get($fields);
    }

    /**
     * @inheritDoc
     */
    public function updateBy(array $where, array $attributes)
    {
        return $this->country->where($where)->update($attributes);
    }
    public function create(array $data)
    {
        return Country::create($data);
    }
}
