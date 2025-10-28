<?php

namespace App\Services;

use App\Repositories\RoleRepository;
use Illuminate\Database\Eloquent\Collection;

/**
 * Class BrandService
 * @package App\Services
 */
class RoleService implements ServiceInterface
{
    /** @var RoleRepository */
    protected $roleRepository;

    /**
     * BrandService constructor.
     * @param RoleRepository $roleRepository
     */
    public function __construct(RoleRepository $roleRepository)
    {
        $this->roleRepository = $roleRepository;
    }
   
    public function getAll($fields = ["*"])
    {
        return $this->roleRepository->getAll($fields);
    }

    /**
     * @inheritDoc
     */
    public function getById($id)
    {
        return $this->roleRepository->getById($id);
    }

    
    public function save($data)
    {
        return $this->roleRepository->save($data);
    }

    /**
     * @inheritDoc
     */
    public function update($data, $id)
    {
        return $this->roleRepository->update($data, $id);
    }

    /**
     * @inheritDoc
     */
    public function delete($id)
    {
        return $this->roleRepository->delete($id);
    }
    
    public function create(array $data)
    {
        return $this->roleRepository->create($data);
    }
}
