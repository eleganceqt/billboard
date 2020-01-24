<?php

trait billboardModelable
{
    /**
     * @var waModel
     */
    protected $model;

    /**
     * @param waModel $model
     *
     * @return void
     */
    public function setModel(waModel $model)
    {
        $this->model = $model;
    }

    /**
     * @return waModel|billboardModel|billboardCityModel|billboardCategoryModel
     */
    public function model()
    {
        return $this->model;
    }
}
