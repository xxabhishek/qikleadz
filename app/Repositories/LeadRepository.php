<?php

namespace App\Repositories;

use App\Models\Lead;

/**
 * Class LeadRepository
 * @package App\Repositories
 */
class LeadRepository implements RepositoryInterface
{
    /** @var Lead */
    protected $lead;

    /**
     * CountryRepository constructor.
     * @param Lead $lead
     */
    public function __construct(Lead $lead)
    {
        $this->lead = $lead;
    }

    /**
     * @inheritDoc
     */
    public function getAll($fields = ["*"])
    {
        return $this->lead->all($fields);
    }

    /**
     * @inheritDoc
     */
    public function getById($id)
    {
        return $this->lead->findOrFail($id);
    }
    

    /**
     * @inheritDoc
     */
    public function save($data)
    {
       $lead = new $this->lead;
       $lead->save($data);

        return $lead->fresh();
    }

    /**
     * @inheritDoc
     */
    public function update($data, $id)
    {
        $lead = $this->getById($id);
        $lead->update($data);

        return $lead;
    }

    /**
     * @inheritDoc
     */
    public function delete($id)
    {
        $lead = $this->getById($id);
        $lead->delete();

        return $lead;
    }

    /**
     * @inheritDoc
     */
    public function whereBy(array $attributes, array $fields = ["*"])
    {
        return $this->lead->where($attributes)->get($fields);
    }

    /**
     * @inheritDoc
     */
    public function updateBy(array $where, array $attributes)
    {
        return $this->lead->where($where)->update($attributes);
    }
    public function create(array $data)
    {
        return Lead::create($data);
    }
}
