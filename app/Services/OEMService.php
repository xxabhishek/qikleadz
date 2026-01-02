<?php

namespace App\Services;

use App\Repositories\OEMRepository;
use Illuminate\Database\Eloquent\Collection;

/**
 * Class CountryService
 * @package App\Services
 */
class OemService implements ServiceInterface
{
    /** @var OEMRepository */
    protected $oemRepository;

    /**
     * CountryService constructor.
     * @param OEMRepository $oemRepository
     */
    public function __construct(OEMRepository $oemRepository)
    {
        $this->oemRepository = $oemRepository;
    }

    public function getAll($fields = ["*"])
    {
        return $this->oemRepository->getAll($fields);
    }

    /**
     * @inheritDoc
     */
    public function getById($id)
    {
        return $this->oemRepository->getById($id);
    }


    public function save($data)
    {
        return $this->oemRepository->save($data);
    }

    /**
     * @inheritDoc
     */
    public function update($data, $id)
    {
        return $this->oemRepository->update($data, $id);
    }

    /**
     * @inheritDoc
     */
    public function delete($id)
    {
        return $this->oemRepository->delete($id);
    }

    public function create(array $data)
    {
        return $this->oemRepository->create($data);
    }
}
