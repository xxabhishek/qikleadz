<?php

namespace App\Services;

use App\Repositories\ColorWiseVariantRateRepository;
use Illuminate\Database\Eloquent\Collection;

/**
 * Class ColorWiseVariantRateService
 * @package App\Services
 */
class ColorWiseVariantRateService implements ServiceInterface
{
    /** @var ColorWiseVariantRateRepository */
    protected $colorWiseVariantRateRepository;

    /**
     * ColorWiseVariantRateService constructor.
     * @param ColorWiseVariantRateRepository $colorWiseVariantRateRepository
     */
    public function __construct(ColorWiseVariantRateRepository $colorWiseVariantRateRepository)
    {
        $this->colorWiseVariantRateRepository = $colorWiseVariantRateRepository;
    }
   
    public function getAll($fields = ["*"])
    {
        return $this->colorWiseVariantRateRepository->getAll($fields);
    }

    /**
     * @inheritDoc
     */
    public function getById($id)
    {
        return $this->colorWiseVariantRateRepository->getById($id);
    }

    
    public function save($data)
    {
        return $this->colorWiseVariantRateRepository->save($data);
    }

    /**
     * @inheritDoc
     */
    public function update($data, $id)
    {
        return $this->colorWiseVariantRateRepository->update($data, $id);
    }

    /**
     * @inheritDoc
     */
    public function delete($id)
    {
        return $this->colorWiseVariantRateRepository->delete($id);
    }
    
    public function create(array $data)
    {
        return $this->colorWiseVariantRateRepository->create($data);
    }
}
