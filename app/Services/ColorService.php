<?php

namespace App\Services;

use App\Repositories\ColorRepository;
use Illuminate\Database\Eloquent\Collection;

/**
 * Class ColorService
 * @package App\Services
 */
class ColorService implements ServiceInterface
{
    /** @var ColorRepository */
    protected $colorRepository;

    /**
     * CountryService constructor.
     * @param ColorRepository $colorRepository
     */
    public function __construct(ColorRepository $colorRepository)
    {
        $this->colorRepository = $colorRepository;
    }
   
    public function getAll($fields = ["*"])
    {
        return $this->colorRepository->getAll($fields);
    }

    /**
     * @inheritDoc
     */
    public function getById($id)
    {
        return $this->colorRepository->getById($id);
    }

    
    public function save($data)
    {
        return $this->colorRepository->save($data);
    }

    /**
     * @inheritDoc
     */
    public function update($data, $id)
    {
        return $this->colorRepository->update($data, $id);
    }

    /**
     * @inheritDoc
     */
    public function delete($id)
    {
        return $this->colorRepository->delete($id);
    }
    
    public function create(array $data)
    {
        return $this->colorRepository->create($data);
    }
}
