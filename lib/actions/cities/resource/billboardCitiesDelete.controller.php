<?php

class billboardCitiesDeleteController extends billboardJsonController
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

            $this->deleteRecord();
        }
    }

    /**
     * Delete city record.
     *
     * @return void
     */
    protected function deleteRecord()
    {
        $this->model()->deleteById($this->request['id']);
    }

    /**
     * @inheritDoc
     */
    protected function requestInputs()
    {
        $this->request = [
            'id' => waRequest::request('id', null, waRequest::TYPE_INT)
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
    }
}
