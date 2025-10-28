<?php

namespace App\Repositories;

use App\Models\Gallery;

/**
 * Class GalleryRepository
 * @package App\Repositories
 */
class GalleryRepository implements RepositoryInterface
{
    /** @var Gallery */
    protected $gallery;

    /**
     * CountryRepository constructor.
     * @param Gallery $gallery
     */
    public function __construct(Gallery $gallery)
    {
        $this->gallery = $gallery;
    }

    /**
     * @inheritDoc
     */
    public function getAll($fields = ["*"])
    {
        return $this->gallery->all($fields);
    }

    /**
     * @inheritDoc
     */
    public function getById($id)
    {
        return $this->gallery->findOrFail($id);
    }
    

    /**
     * @inheritDoc
     */
    public function save($data)
    {
       $gallery = new $this->gallery;
       $gallery->save($data);

        return $gallery->fresh();
    }

    /**
     * @inheritDoc
     */
    public function update($data, $id)
    {
        $gallery = $this->getById($id);
        $gallery->update($data);

        return $gallery;
    }

    /**
     * @inheritDoc
     */
    public function delete($id)
    {
        $gallery = $this->getById($id);
        $gallery->delete();

        return $gallery;
    }

    /**
     * @inheritDoc
     */
    public function whereBy(array $attributes, array $fields = ["*"])
    {
        return $this->gallery->where($attributes)->get($fields);
    }

    /**
     * @inheritDoc
     */
    public function updateBy(array $where, array $attributes)
    {
        return $this->gallery->where($where)->update($attributes);
    }
    public function create(array $data)
    {
        return Gallery::create($data);
    }
}
