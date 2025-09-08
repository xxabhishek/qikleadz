<?php

namespace App\Services;

use App\Repositories\CountryRepository;
use Illuminate\Database\Eloquent\Collection;

/**
 * Class CountryService
 * @package App\Services
 */
class CountryService implements ServiceInterface
{
    /** @var CountryRepository */
    protected $countryRepository;

    /**
     * CountryService constructor.
     * @param CountryRepository $countryRepository
     */
    public function __construct(CountryRepository $countryRepository)
    {
        $this->countryRepository = $countryRepository;
    }
   
    public function getAll($fields = ["*"])
    {
        return $this->countryRepository->getAll($fields);
    }

    /**
     * @inheritDoc
     */
    public function getById($id)
    {
        return $this->countryRepository->getById($id);
    }

    
    public function save($data)
    {
        return $this->countryRepository->save($data);
    }

    /**
     * @inheritDoc
     */
    public function update($data, $id)
    {
        return $this->countryRepository->update($data, $id);
    }

    /**
     * @inheritDoc
     */
    public function delete($id)
    {
        return $this->countryRepository->delete($id);
    }
    
    public function create(array $data)
    {
        return $this->countryRepository->create($data);
    }
}
