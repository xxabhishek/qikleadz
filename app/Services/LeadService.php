<?php

namespace App\Services;

use App\Repositories\LeadRepository;
use Illuminate\Database\Eloquent\Collection;

/**
 * Class LeadService
 * @package App\Services
 */
class LeadService implements ServiceInterface
{
    /** @var LeadRepository */
    protected $leadRepository;

    /**
     * CountryService constructor.
     * @param LeadRepository $leadRepository
     */
    public function __construct(LeadRepository $leadRepository)
    {
        $this->leadRepository = $leadRepository;
    }
   
    public function getAll($fields = ["*"])
    {
        return $this->leadRepository->getAll($fields);
    }

    /**
     * @inheritDoc
     */
    public function getById($id)
    {
        return $this->leadRepository->getById($id);
    }

    
    public function save($data)
    {
        return $this->leadRepository->save($data);
    }

    /**
     * @inheritDoc
     */
    public function update($data, $id)
    {
        return $this->leadRepository->update($data, $id);
    }

    /**
     * @inheritDoc
     */
    public function delete($id)
    {
        return $this->leadRepository->delete($id);
    }
    
    public function create(array $data)
    {
        return $this->leadRepository->create($data);
    }
}
