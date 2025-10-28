<?php

namespace App\Services;

use App\Repositories\GalleryRepository;
use Illuminate\Database\Eloquent\Collection;

/**
 * Class CountryService
 * @package App\Services
 */
class GalleryService implements ServiceInterface
{
    /** @var GalleryRepository */
    protected $galleryRepository;

    /**
     * GalleryService constructor.
     * @param GalleryRepository $galleryRepository
     */
    public function __construct(GalleryRepository $galleryRepository)
    {
        $this->galleryRepository = $galleryRepository;
    }
   
    public function getAll($fields = ["*"])
    {
        return $this->galleryRepository->getAll($fields);
    }

    /**
     * @inheritDoc
     */
    public function getById($id)
    {
        return $this->galleryRepository->getById($id);
    }

    
    public function save($data)
    {
        return $this->galleryRepository->save($data);
    }

    /**
     * @inheritDoc
     */
    public function update($data, $id)
    {
        return $this->galleryRepository->update($data, $id);
    }

    /**
     * @inheritDoc
     */
    public function delete($id)
    {
        return $this->galleryRepository->delete($id);
    }
    
    public function create(array $data)
    {
        return $this->galleryRepository->create($data);
    }
}
