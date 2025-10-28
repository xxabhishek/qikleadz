<?php

namespace App\Services;

use App\Repositories\BrandRepository;
use Illuminate\Database\Eloquent\Collection;

/**
 * Class BrandService
 * @package App\Services
 */
class BrandService implements ServiceInterface
{
    /** @var BrandRepository */
    protected $brandRepository;

    /**
     * BrandService constructor.
     * @param BrandRepository $brandRepository
     */
    public function __construct(BrandRepository $brandRepository)
    {
        $this->brandRepository = $brandRepository;
    }

    public function getAll($fields = ["*"])
    {
        return $this->brandRepository->getAll($fields);
    }

    /**
     * @inheritDoc
     */
    public function getById($id)
    {
        return $this->brandRepository->getById($id);
    }


    public function save($data)
    {
        return $this->brandRepository->save($data);
    }

    /**
     * @inheritDoc
     */
    public function update($data, $id)
    {
        return $this->brandRepository->update($data, $id);
    }

    /**
     * @inheritDoc
     */
    public function delete($id)
    {
        return $this->brandRepository->delete($id);
    }

    public function create(array $data)
    {
        return $this->brandRepository->create($data);
    }
}
