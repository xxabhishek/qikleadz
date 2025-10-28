<?php

namespace App\Services;

use App\Repositories\FeatureRepository;
use Illuminate\Database\Eloquent\Collection;

/**
 * Class FeatureService
 * @package App\Services
 */
class FeatureService implements ServiceInterface
{
    /** @var FeatureRepository */
    protected $featureRepository;

    /**
     * FeatureService constructor.
     * @param FeatureRepository $featureRepository
     */
    public function __construct(FeatureRepository $featureRepository)
    {
        $this->featureRepository = $featureRepository;
    }
   
    public function getAll($fields = ["*"])
    {
        return $this->featureRepository->getAll($fields);
    }

    /**
     * @inheritDoc
     */
    public function getById($id)
    {
        return $this->featureRepository->getById($id);
    }

    
    public function save($data)
    {
        return $this->featureRepository->save($data);
    }

    /**
     * @inheritDoc
     */
    public function update($data, $id)
    {
        return $this->featureRepository->update($data, $id);
    }

    /**
     * @inheritDoc
     */
    public function delete($id)
    {
        return $this->featureRepository->delete($id);
    }
    
    public function create(array $data)
    {
        return $this->featureRepository->create($data);
    }
}
