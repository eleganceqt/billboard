<?php

class billboardCitiesEditController extends billboardJsonController
{
    /**
     * @inheritDoc
     */
    public function execute()
    {
        if (! $this->failsValidation()) {

            $city = (new billboardCityModel())->findOrFail($this->request['id']);

            $this->response['content'] = (new billboardCitiesModalAction())->renderWith(compact('city'));
        }
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
