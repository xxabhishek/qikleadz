<?php

namespace App\Repositories;

use App\Models\Color;

/**
 * Class ColorRepository
 * @package App\Repositories
 */
class ColorRepository implements RepositoryInterface
{
    /** @var Color */
    protected $color;

    /**
     * CountryRepository constructor.
     * @param Color $color
     */
    public function __construct(Color $color)
    {
        $this->color = $color;
    }

    /**
     * @inheritDoc
     */
    public function getAll($fields = ["*"])
    {
        return $this->color->all($fields);
    }

    /**
     * @inheritDoc
     */
    public function getById($id)
    {
        return $this->color->findOrFail($id);
    }
    

    /**
     * @inheritDoc
     */
    public function save($data)
    {
       $color = new $this->color;
       $color->save($data);

        return $color->fresh();
    }

    /**
     * @inheritDoc
     */
    public function update($data, $id)
    {
        $color = $this->getById($id);
        $color->update($data);

        return $color;
    }

    /**
     * @inheritDoc
     */
    public function delete($id)
    {
        $color = $this->getById($id);
        $color->delete();

        return $color;
    }

    /**
     * @inheritDoc
     */
    public function whereBy(array $attributes, array $fields = ["*"])
    {
        return $this->color->where($attributes)->get($fields);
    }

    /**
     * @inheritDoc
     */
    public function updateBy(array $where, array $attributes)
    {
        return $this->color->where($where)->update($attributes);
    }
    public function create(array $data)
    {
        return Color::create($data);
    }
}
