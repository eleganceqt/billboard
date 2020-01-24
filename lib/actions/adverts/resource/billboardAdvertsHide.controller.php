<?php

class billboardAdvertsHideController extends billboardJsonController
{
    use billboardUseModels;

    /**
     * @inheritDoc
     */
    public function execute()
    {
        if (! $this->failsValidation()) {
            $this->model('advert')->setHidden($this->request['id']);
        }
    }

    /**
     * @inheritDoc
     */
    protected function requestInputs()
    {
        $this->request = [
            'id' => waRequest::request('advert_id', null, waRequest::TYPE_INT)
        ];
    }

    protected function runValidation()
    {
        if (billboardValidation::notPositiveInt($this->request['id'])) {
            $this->errors[] = 'Недействительный идентификатор объявления.';
        }
    }
}
