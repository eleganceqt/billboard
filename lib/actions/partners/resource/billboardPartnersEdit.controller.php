<?php

class billboardPartnersEditController extends billboardJsonController
{
    use billboardUseModels;

    /**
     * @inheritDoc
     */
    public function execute()
    {
        if (! $this->failsValidation()) {

            $partner = new waContact($this->request['id']);

            $count = $this->model('advert')->countByPartner($this->request['id']);

            $partner->set('active_count', $count['active_count']);
            $partner->set('total_count', $count['total_count']);

            $this->response['content'] = (new billboardPartnersModalAction())->renderWith(compact('partner'));
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
            $this->errors[] = 'Недействительный идентификатор партнёра.';
        }
    }
}
