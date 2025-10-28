<?php

namespace App\Repositories;

use App\Models\TechSpec;

/**
 * Class TechSpecRepository
 * @package App\Repositories
 */
class TechSpecRepository implements RepositoryInterface
{
    /** @var TechSpec */
    protected $techSpec;

    /**
     * TechSpecRepository constructor.
     * @param TechSpec $techSpec
     */
    public function __construct(TechSpec $techSpec)
    {
        $this->techSpec = $techSpec;
    }

    /**
     * @inheritDoc
     */
    public function getAll($fields = ["*"])
    {
        return $this->techSpec->all($fields);
    }

    /**
     * @inheritDoc
     */
    public function getById($id)
    {
        return $this->techSpec->findOrFail($id);
    }
    

    /**
     * @inheritDoc
     */
    public function save($data)
    {
       $techSpec = new $this->techSpec;
       $techSpec->save($data);

        return $techSpec->fresh();
    }

    /**
     * @inheritDoc
     */
    public function update($data, $id)
    {
        $techSpec = $this->getById($id);
        $techSpec->update($data);

        return $techSpec;
    }

    /**
     * @inheritDoc
     */
    public function delete($id)
    {
        $techSpec = $this->getById($id);
        $techSpec->delete();

        return $techSpec;
    }

    /**
     * @inheritDoc
     */
    public function whereBy(array $attributes, array $fields = ["*"])
    {
        return $this->techSpec->where($attributes)->get($fields);
    }

    /**
     * @inheritDoc
     */
    public function updateBy(array $where, array $attributes)
    {
        return $this->techSpec->where($where)->update($attributes);
    }
    public function create(array $data)
    {
        return TechSpec::create($data);
    }
}
