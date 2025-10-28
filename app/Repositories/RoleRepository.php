<?php

namespace App\Repositories;

use App\Models\Role;

/**
 * Class RoleRepository
 * @package App\Repositories
 */
class RoleRepository implements RepositoryInterface
{
    /** @var Role */
    protected $role;

    /**
     * RoleRepository constructor.
     * @param Role $role
     */
    public function __construct(Role $role)
    {
        $this->role = $role;
    }

    /**
     * @inheritDoc
     */
    public function getAll($fields = ["*"])
    {
        return $this->role->all($fields);
    }

    /**
     * @inheritDoc
     */
    public function getById($id)
    {
        return $this->role->findOrFail($id);
    }
    

    /**
     * @inheritDoc
     */
    public function save($data)
    {
       $role = new $this->role;
       $role->save($data);

        return $role->fresh();
    }

    /**
     * @inheritDoc
     */
    public function update($data, $id)
    {
        $role = $this->getById($id);
        $role->update($data);

        return $role;
    }

    /**
     * @inheritDoc
     */
    public function delete($id)
    {
        $role = $this->getById($id);
        $role->delete();

        return $role;
    }

    /**
     * @inheritDoc
     */
    public function whereBy(array $attributes, array $fields = ["*"])
    {
        return $this->role->where($attributes)->get($fields);
    }

    /**
     * @inheritDoc
     */
    public function updateBy(array $where, array $attributes)
    {
        return $this->role->where($where)->update($attributes);
    }
    public function create(array $data)
    {
        return Role::create($data);
    }
}
