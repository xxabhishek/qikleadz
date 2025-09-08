<?php

namespace App\Repositories;

use App\Models\Gallery;

class GalleryRepository
{
    protected $gallery;

    public function __construct(Gallery $gallery)
    {
        $this->gallery = $gallery;
    }

    public function getAll()
    {
        return $this->gallery
            ->with(['brand', 'variant', 'color', 'fuelType'])
            ->orderBy('id', 'desc')
            ->get();
    }

    public function findById($id)
    {
        return $this->gallery
            ->with(['brand', 'variant', 'color', 'fuelType'])
            ->findOrFail($id);
    }

    public function create(array $data)
    {
        return $this->gallery->create($data);
    }

    public function update(Gallery $gallery, array $data)
    {
        $gallery->update($data);
        return $gallery;
    }

    public function delete(Gallery $gallery)
    {
        return $gallery->delete();
    }

    public function existsCombination($brandId, $variantId, $colorId, $fuelTypeId, $ignoreId = null)
    {
        $query = $this->gallery
            ->where('brand_id', $brandId)
            ->where('variant_id', $variantId)
            ->where('color_id', $colorId)
            ->where('fuel_type_id', $fuelTypeId);

        if ($ignoreId) {
            $query->where('id', '!=', $ignoreId);
        }

        return $query->exists();
    }
}