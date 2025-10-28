<?php

namespace App\Services;

use App\Repositories\VariantRepository;
use Illuminate\Database\Eloquent\Collection;

/**
 * Class VariantService
 * @package App\Services
 */
class VariantService implements ServiceInterface
{
    /** @var VariantRepository */
    protected $variantRepository;

    /**
     * VariantService constructor.
     * @param VariantRepository $variantRepository
     */
    public function __construct(VariantRepository $variantRepository)
    {
        $this->variantRepository = $variantRepository;
    }
   
    public function getAll($fields = ["*"])
    {
        return $this->variantRepository->getAll($fields);
    }

    /**
     * @inheritDoc
     */
    public function getById($id)
    {
        return $this->variantRepository->getById($id);
    }

    
    public function save($data)
    {
        return $this->variantRepository->save($data);
    }

    /**
     * @inheritDoc
     */
    public function update($data, $id)
    {
        return $this->variantRepository->update($data, $id);
    }

    /**
     * @inheritDoc
     */
    public function delete($id)
    {
        return $this->variantRepository->delete($id);
    }
    
    public function create(array $data)
    {
        return $this->variantRepository->create($data);
    }
}
