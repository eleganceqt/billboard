<?php

class billboardCitiesStoreController extends billboardJsonController
{
    use billboardModelable;

    /**
     * @inheritDoc
     */
    protected function preExecute()
    {
        $this->setModel(new billboardCityModel());

        parent::preExecute();
    }

    /**
     * @inheritDoc
     */
    public function execute()
    {
        if (! $this->failsValidation()) {

            $this->storeRecord();
        }
    }

    /**
     * Store city record.
     *
     * @return void
     */
    protected function storeRecord()
    {
        $attributes = $this->request;

        $this->model()->insert($attributes);
    }

    /**
     * @inheritDoc
     */
    protected function requestInputs()
    {
        $this->request = [
            'name'         => waRequest::request('name', '', waRequest::TYPE_STRING_TRIM),
            'country_iso3' => waRequest::request('country_iso3', 'rus', waRequest::TYPE_STRING_TRIM),
            'ranking'      => waRequest::request('ranking', 0, waRequest::TYPE_INT),
        ];
    }

    /**
     * @inheritDoc
     */
    protected function runValidation()
    {
        if (billboardValidation::blank($this->request['name'])) {
            $this->errors[] = 'Поле название обязательно для заполнения.';
        }

        if (billboardValidation::notBlank($this->request['name']) && $this->model()->isSlugTaken($this->request['name'])) {
            $this->errors[] = 'Город с таким названием уже существует.';
        }
    }
}
