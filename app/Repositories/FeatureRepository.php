<?php

namespace App\Repositories;

use App\Models\Feature;

/**
 * Class FeatureRepository
 * @package App\Repositories
 */
class FeatureRepository implements RepositoryInterface
{
    /** @var Feature */
    protected $feature;

    /**
     * FeatureRepository constructor.
     * @param Feature $feature
     */
    public function __construct(Feature $feature)
    {
        $this->feature = $feature;
    }

    /**
     * @inheritDoc
     */
    public function getAll($fields = ["*"])
    {
        return $this->feature->all($fields);
    }

    /**
     * @inheritDoc
     */
    public function getById($id)
    {
        return $this->feature->findOrFail($id);
    }
    

    /**
     * @inheritDoc
     */
    public function save($data)
    {
       $feature = new $this->feature;
       $feature->save($data);

        return $feature->fresh();
    }

    /**
     * @inheritDoc
     */
    public function update($data, $id)
    {
        $feature = $this->getById($id);
        $feature->update($data);

        return $feature;
    }

    /**
     * @inheritDoc
     */
    public function delete($id)
    {
        $feature = $this->getById($id);
        $feature->delete();

        return $feature;
    }

    /**
     * @inheritDoc
     */
    public function whereBy(array $attributes, array $fields = ["*"])
    {
        return $this->feature->where($attributes)->get($fields);
    }

    /**
     * @inheritDoc
     */
    public function updateBy(array $where, array $attributes)
    {
        return $this->feature->where($where)->update($attributes);
    }
    public function create(array $data)
    {
        return Feature::create($data);
    }
}
