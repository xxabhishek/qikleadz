<?php

namespace App\Repositories;

use App\Models\Variant;

/**
 * Class VariantRepository
 * @package App\Repositories
 */
class VariantRepository implements RepositoryInterface
{
    /** @var Variant */
    protected $variant;

    /**
     * VariantRepository constructor.
     * @param Variant $variant
     */
    public function __construct(Variant $variant)
    {
        $this->variant = $variant;
    }

    /**
     * @inheritDoc
     */
    public function getAll($fields = ["*"])
    {
        return $this->variant->all($fields);
    }

    /**
     * @inheritDoc
     */
    public function getById($id)
    {
        return $this->variant->findOrFail($id);
    }
    

    /**
     * @inheritDoc
     */
    public function save($data)
    {
       $variant = new $this->variant;
       $variant->save($data);

        return $variant->fresh();
    }

    /**
     * @inheritDoc
     */
    public function update($data, $id)
    {
        $variant = $this->getById($id);
        $variant->update($data);

        return $variant;
    }

    /**
     * @inheritDoc
     */
    public function delete($id)
    {
        $variant = $this->getById($id);
        $variant->delete();

        return $variant;
    }

    /**
     * @inheritDoc
     */
    public function whereBy(array $attributes, array $fields = ["*"])
    {
        return $this->variant->where($attributes)->get($fields);
    }

    /**
     * @inheritDoc
     */
    public function updateBy(array $where, array $attributes)
    {
        return $this->variant->where($where)->update($attributes);
    }
    public function create(array $data)
    {
        return Variant::create($data);
    }
}
