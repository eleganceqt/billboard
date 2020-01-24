<?php

class billboardCategoriesHideAllController extends billboardJsonController
{
    use billboardUseModels;

    /**
     * @inheritDoc
     */
    public function execute()
    {
        if (! $this->failsValidation()) {
            $this->hideCategoriesAdverts();
        }
    }

    protected function hideCategoriesAdverts()
    {
        $this->model('advert')->hideByCategory($this->request['id']);
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
            $this->errors[] = 'Недействительный идентификатор категории.';
        }
    }
}
