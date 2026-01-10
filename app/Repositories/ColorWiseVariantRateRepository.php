<?php

namespace App\Repositories;

use App\Models\ColorWiseVariantRate;

/**
 * Class ColorWiseVariantRateRepository
 * @package App\Repositories
 */
class ColorWiseVariantRateRepository implements RepositoryInterface
{
    /** @var ColorWiseVariantRate */
    protected $colorWiseVariantRate;

    /**colorWiseVariantRate
     * CountryRepository constructor.
     * @param ColorWiseVariantRate $colorWiseVariantRate
     */
    public function __construct(ColorWiseVariantRate $colorWiseVariantRate)
    {
        $this->colorWiseVariantRate = $colorWiseVariantRate;
    }

    /**
     * @inheritDoc
     */
    public function getAll($fields = ["*"])
    {
        return $this->colorWiseVariantRate->all($fields);
    }

    /**
     * @inheritDoc
     */
    public function getById($id)
    {
        return $this->colorWiseVariantRate->findOrFail($id);
    }
    

    /**
     * @inheritDoc
     */
    public function save($data)
    {
       $colorWiseVariantRate = new $this->colorWiseVariantRate;
       $colorWiseVariantRate->save($data);

        return $colorWiseVariantRate->fresh();
    }

    /**
     * @inheritDoc
     */
    public function update($data, $id)
    {
        $colorWiseVariantRate = $this->getById($id);
        $colorWiseVariantRate->update($data);

        return $colorWiseVariantRate;
    }

    /**
     * @inheritDoc
     */
    public function delete($id)
    {
        $colorWiseVariantRate = $this->getById($id);
        $colorWiseVariantRate->delete();

        return $colorWiseVariantRate;
    }

    /**
     * @inheritDoc
     */
    public function whereBy(array $attributes, array $fields = ["*"])
    {
        return $this->colorWiseVariantRate->where($attributes)->get($fields);
    }

    /**
     * @inheritDoc
     */
    public function updateBy(array $where, array $attributes)
    {
        return $this->colorWiseVariantRate->where($where)->update($attributes);
    }
    public function create(array $data)
    {
        return ColorWiseVariantRate::create($data);
    }
}
