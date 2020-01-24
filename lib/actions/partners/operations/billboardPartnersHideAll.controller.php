<?php

class billboardPartnersHideAllController extends billboardJsonController
{
    use billboardUseModels;

    /**
     * @inheritDoc
     */
    public function execute()
    {
        if (! $this->failsValidation()) {
            $this->hidePartnersAdverts();
        }
    }

    protected function hidePartnersAdverts()
    {
        $this->model('advert')->hideByPartner($this->request['id']);
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
            $this->errors[] = 'Недействительный идентификатор партнёра.';
        }
    }
}
