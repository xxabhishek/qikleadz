<?php

namespace App\Services;

use App\Repositories\DealerAreaMapRepository;
use Illuminate\Database\Eloquent\Collection;

/**
 * Class dealerAreaMapService
 * @package App\Services
 */
class DealerAreaMapService implements ServiceInterface
{
    /** @var DealerAreaMapRepository */
    protected $dealerAreaMapRepository;

    /**
     * CountryService constructor.
     * @param DealerAreaMapRepository $dealerAreaMapRepository
     */
    public function __construct(DealerAreaMapRepository $dealerAreaMapRepository)
    {
        $this->dealerAreaMapRepository = $dealerAreaMapRepository;
    }
   
    public function getAll($fields = ["*"])
    {
        return $this->dealerAreaMapRepository->getAll($fields);
    }

    /**
     * @inheritDoc
     */
    public function getById($id)
    {
        return $this->dealerAreaMapRepository->getById($id);
    }

    
    public function save($data)
    {
        return $this->dealerAreaMapRepository->save($data);
    }

    /**
     * @inheritDoc
     */
    public function update($data, $id)
    {
        return $this->dealerAreaMapRepository->update($data, $id);
    }

    /**
     * @inheritDoc
     */
    public function delete($id)
    {
        return $this->dealerAreaMapRepository->delete($id);
    }
    
    public function create(array $data)
    {
        return $this->dealerAreaMapRepository->create($data);
    }
    public function find($id)
{
    return $this->dealerAreaMapRepository->find($id);
}

}
