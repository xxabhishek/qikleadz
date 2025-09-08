<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Interface RepositoryInterface
 * @package App\Repositories
 */
interface RepositoryInterface {

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

    /**
     * To get all records by particular conditions
     *
     * @param array $attributes
     * @param array fields
     * @return collection
     */
    public function whereBy(array $attributes, array $fields = ["*"]);

    /**
     * To update record by matching multiple attributes
     *
     * @param array $where
     * @param array $attributes
     * @return boolean
     */
    public function updateBy(array $where, array $attributes);
}
