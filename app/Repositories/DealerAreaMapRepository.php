<?php

namespace App\Repositories;

use App\Models\DealerAreaMap;

/**
 * Class CountryRepository
 * @package App\Repositories
 */
class DealerAreaMapRepository implements RepositoryInterface
{
    /** @var DealerAreaMap */
    protected $dealerAreaMap;

    /**
     * CountryRepository constructor.
     * @param DealerAreaMap $dealerAreaMap
     */
    public function __construct(DealerAreaMap $dealerAreaMap)
    {
        $this->dealerAreaMap = $dealerAreaMap;
    }

    /**
     * @inheritDoc
     */
    public function getAll($fields = ["*"])
    {
        return $this->dealerAreaMap->all($fields);
    }

    /**
     * @inheritDoc
     */
    public function getById($id)
    {
        return $this->dealerAreaMap->findOrFail($id);
    }
    

    /**
     * @inheritDoc
     */
    public function save($data)
    {
       $dealerAreaMap = new $this->dealerAreaMap;
       $dealerAreaMap->save($data);

        return $dealerAreaMap->fresh();
    }

    /**
     * @inheritDoc
     */
    public function update($data, $id)
    {
        $dealerAreaMap = $this->getById($id);
        $dealerAreaMap->update($data);

        return $dealerAreaMap;
    }

    /**
     * @inheritDoc
     */
    public function delete($id)
    {
        $dealerAreaMap = $this->getById($id);
        $dealerAreaMap->delete();

        return $dealerAreaMap;
    }

    /**
     * @inheritDoc
     */
    public function whereBy(array $attributes, array $fields = ["*"])
    {
        return $this->dealerAreaMap->where($attributes)->get($fields);
    }

    /**
     * @inheritDoc
     */
    public function updateBy(array $where, array $attributes)
    {
        return $this->dealerAreaMap->where($where)->update($attributes);
    }
    public function create(array $data)
    {
        return DealerAreaMap::create($data);
    }
    public function find($id)
{
    return DealerAreaMap::find($id);
}

}
