<?php

namespace App\Repositories;

use App\Models\OEM;

/**
 * Class OEMRepository
 * @package App\Repositories
 */
class OEMRepository implements RepositoryInterface
{
    /** @var OEM */
    protected $oem;

    /**
     * CountryRepository constructor.
     * @param OEM $oem
     */
    public function __construct(OEM $oem)
    {
        $this->oem = $oem;
    }

    /**
     * @inheritDoc
     */
    public function getAll($fields = ["*"])
    {
        return $this->oem->all($fields);
    }

    /**
     * @inheritDoc
     */
    public function getById($id)
    {
        return $this->oem->findOrFail($id);
    }
    

    /**
     * @inheritDoc
     */
    public function save($data)
    {
       $oem = new $this->oem;
       $oem->save($data);

        return $oem->fresh();
    }

    /**
     * @inheritDoc
     */
    public function update($data, $id)
    {
        $oem = $this->getById($id);
        $oem->update($data);

        return $oem;
    }

    /**
     * @inheritDoc
     */
    public function delete($id)
    {
        $oem = $this->getById($id);
        $oem->delete();

        return $oem;
    }

    /**
     * @inheritDoc
     */
    public function whereBy(array $attributes, array $fields = ["*"])
    {
        return $this->oem->where($attributes)->get($fields);
    }

    /**
     * @inheritDoc
     */
    public function updateBy(array $where, array $attributes)
    {
        return $this->oem->where($where)->update($attributes);
    }
    public function create(array $data)
    {
        return OEM::create($data);
    }
}
