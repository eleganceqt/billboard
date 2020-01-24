<?php

class billboardAdvertsEditController extends billboardJsonController
{
    use billboardUseModels;

    /**
     * @inheritDoc
     */
    public function execute()
    {
        if (! $this->failsValidation()) {

            $advert = (new billboardAdvertModel())->findOrFail($this->request['id']);

            $this->loadPartner($advert);

            $this->response['content'] = (new billboardAdvertsModalAction())->renderWith(compact('advert'));
        }
    }

    protected function loadPartner(&$advert)
    {
        $advert['partner'] = new waContact($advert['partner_id']);
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
            $this->errors[] = 'Недействительный идентификатор объявления.';
        }
    }
}
