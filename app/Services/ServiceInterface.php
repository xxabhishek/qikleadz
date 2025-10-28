<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Interface ServiceInterface
 * @package App\Services
 */
interface ServiceInterface
{
    /**
     * Get all models.
     *
     * @param array $fields
     * @return Collection
     */
    public function getAll($fields = ["*"]);

    /**
     * Get model by id
     *
     * @param $id
     * @return Model
     */
    public function getById($id);

    /**
     * Save model data
     *
     * @param array $data
     * @return Model
     */
    public function save($data);

    /**
     * Update Model
     *
     * @param array $data
     * @param int $id
     * @return mixed
     */
    public function update($data, $id);

    /**
     * Delete model data
     *
     * @param int $id
     * @return mixed
     */
    public function delete($id);
}
