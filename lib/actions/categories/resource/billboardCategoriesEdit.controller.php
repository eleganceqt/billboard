<?php

class billboardCategoriesEditController extends billboardJsonController
{
    /**
     * @inheritDoc
     */
    public function execute()
    {
        if (! $this->failsValidation()) {

            $category = (new billboardCategoryModel())->findOrFail($this->request['id']);

            $this->response['content'] = (new billboardCategoriesModalAction())->renderWith(compact('category'));
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
            $this->errors[] = 'Недействительный идентификатор категории.';
        }
    }
}
