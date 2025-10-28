<?php

namespace App\Services;

use App\Repositories\TechSpecRepository;
use Illuminate\Database\Eloquent\Collection;

/**
 * Class TechSpecService
 * @package App\Services
 */
class TechSpecService implements ServiceInterface
{
    /** @var TechSpecRepository */
    protected $techspecRepository;

    /**
     * TechSpecService constructor.
     * @param TechspecRepository $techspecRepository
     */
    public function __construct(TechspecRepository $techspecRepository)
    {
        $this->techspecRepository = $techspecRepository;
    }
   
    public function getAll($fields = ["*"])
    {
        return $this->techspecRepository->getAll($fields);
    }

    /**
     * @inheritDoc
     */
    public function getById($id)
    {
        return $this->techspecRepository->getById($id);
    }

    
    public function save($data)
    {
        return $this->techspecRepository->save($data);
    }

    /**
     * @inheritDoc
     */
    public function update($data, $id)
    {
        return $this->techspecRepository->update($data, $id);
    }

    /**
     * @inheritDoc
     */
    public function delete($id)
    {
        return $this->techspecRepository->delete($id);
    }
    
    public function create(array $data)
    {
        return $this->techspecRepository->create($data);
    }
}
