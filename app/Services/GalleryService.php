<?php

// app/Services/GalleryService.php
namespace App\Services;

// use App\Repositories\GalleryRepository;
use Illuminate\Support\Facades\Storage;
use App\Models\Gallery;
use App\Repositories\GalleryRepository;


class GalleryService
{
    protected $repo;

    public function __construct(GalleryRepository $repo)
    {
        $this->repo = $repo;
    }

    public function list()
    {
        return $this->repo->getAll();
    }

    public function store(array $data)
    {
        if (isset($data['cover_photo'])) {
            $data['cover_photo'] = $data['cover_photo']->store('galleries', 'public');
        }

        if ($this->repo->existsCombination($data['brand_id'], $data['variant_id'], $data['color_id'], $data['fuel_type_id'])) {
            throw new \Exception('This combination already exists.');
        }

        return $this->repo->create($data);
    }

    public function update(Gallery $gallery, array $data)
    {
        if (isset($data['cover_photo'])) {
            if ($gallery->cover_photo && Storage::disk('public')->exists($gallery->cover_photo)) {
                Storage::disk('public')->delete($gallery->cover_photo);
            }
            $data['cover_photo'] = $data['cover_photo']->store('galleries', 'public');
        }

        if ($this->repo->existsCombination($data['brand_id'], $data['variant_id'], $data['color_id'], $data['fuel_type_id'], $gallery->id)) {
            throw new \Exception('This combination already exists.');
        }

        return $this->repo->update($gallery, $data);
    }

    public function delete(Gallery $gallery)
    {
        if ($gallery->cover_photo && Storage::disk('public')->exists($gallery->cover_photo)) {
            Storage::disk('public')->delete($gallery->cover_photo);
        }
        return $this->repo->delete($gallery);
    }
}