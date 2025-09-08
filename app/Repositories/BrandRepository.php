<?php

namespace App\Repositories;

use App\Models\ModelDetail;

/**
 * Class CountryRepository
 * @package App\Repositories
 */
class BrandRepository implements RepositoryInterface
{
    /** @var BrandRepository */
    protected $modelDetail;

    /**
     * CountryRepository constructor.
     * @param BrandRepository $modelDetail
     */
    public function __construct(BrandRepository $modelDetail)
    {
        $this->modelDetail = $modelDetail;
    }

    /**
     * @inheritDoc
     */
    public function getAll($fields = ["*"])
    {
        return $this->modelDetail->all($fields);
    }

    /**
     * @inheritDoc
     */
    public function getById($id)
    {
        return $this->modelDetail->findOrFail($id);
    }


    /**
     * @inheritDoc
     */
    public function save($data)
    {
        $model = new $this->modelDetail;
        $model->save($data);

        return $model->fresh();
    }

    /**
     * @inheritDoc
     */
    public function update($data, $id)
    {
        $model = $this->getById($id);
        $model->update($data);

        return $model;
    }

    /**
     * @inheritDoc
     */
    public function delete($id)
    {
        $model = $this->getById($id);
        $model->delete();

        return $model;
    }

    /**
     * @inheritDoc
     */
    public function whereBy(array $attributes, array $fields = ["*"])
    {
        return $this->modelDetail->where($attributes)->get($fields);
    }

    /**
     * @inheritDoc
     */
    public function updateBy(array $where, array $attributes)
    {
        return $this->modelDetail->where($where)->update($attributes);
    }
    public function create(array $data)
    {
        return BrandRepository::create($data);
    }
}
