<?php

namespace App\Services;

use App\Repositories\BrandRepository;

/**
 * Class CountryService
 * @package App\Services
 */
class BrandService implements ServiceInterface
{
    /** @var BrandRepository */
    protected $modelRepository;

    /**
     * CountryService constructor.
     * @param BrandRepository $modelRepository
     */
    public function __construct(BrandRepository $modelRepository)
    {
        $this->modelRepository = $modelRepository;
    }

    public function getAll($fields = ["*"])
    {
        return $this->modelRepository->getAll($fields);
    }

    /**
     * @inheritDoc
     */
    public function getById($id)
    {
        return $this->modelRepository->getById($id);
    }


    public function save($data)
    {
        return $this->modelRepository->save($data);
    }

    /**
     * @inheritDoc
     */
    public function update($data, $id)
    {
        return $this->modelRepository->update($data, $id);
    }

    /**
     * @inheritDoc
     */
    public function delete($id)
    {
        return $this->modelRepository->delete($id);
    }

    public function create(array $data)
    {
        return $this->modelRepository->create($data);
    }
}