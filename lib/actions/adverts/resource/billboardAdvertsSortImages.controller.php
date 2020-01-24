<?php

class billboardAdvertsSortImagesController extends billboardJsonController
{
    use billboardUseModels;

    /**
     * @inheritDoc
     */
    public function execute()
    {
        if (! $this->failsValidation()) {
            $this->model('advertImages')->updateOrder($this->request['advertId'], $this->request['sort']);
        }
    }

    /**
     * @inheritDoc
     */
    protected function requestInputs()
    {
        $this->request = [
            'advertId' => waRequest::request('advert_id', null, waRequest::TYPE_INT),
            'sort'     => waRequest::request('sort', [], waRequest::TYPE_ARRAY)
        ];
    }

    /**
     * @inheritDoc
     */
    protected function runValidation()
    {
        if (billboardValidation::notPositiveInt($this->request['advertId'])) {
            $this->errors[] = 'Недействительный идентификатор объявления.';
        }
    }
}
