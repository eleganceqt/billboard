<?php

class billboardCitiesUpdateController extends billboardJsonController
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

            $this->updateRecord();
        }
    }

    protected function updateRecord()
    {
        $attributes = $this->request;

        unset($attributes['id']);

        $this->model()->updateById($this->request['id'], $attributes);
    }

    /**
     * @inheritDoc
     */
    protected function requestInputs()
    {
        $this->request = [
            'id'           => waRequest::request('id', null, waRequest::TYPE_INT),
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
        if (billboardValidation::notPositiveInt($this->request['id'])) {
            $this->errors[] = 'Недействительный идентификатор города.';
        }

        if (billboardValidation::blank($this->request['name'])) {
            $this->errors[] = 'Поле название обязательно для заполнения.';
        }

        if (billboardValidation::notBlank($this->request['name']) && $this->model()->isSlugTaken($this->request['name'], $this->request['id'])) {
            $this->errors[] = 'Город с таким названием уже существует.';
        }
    }
}
