<?php

class billboardCategoriesDeleteController extends billboardJsonController
{
    use billboardModelable;

    /**
     * @inheritDoc
     */
    protected function preExecute()
    {
        $this->setModel(new billboardCategoryModel());

        parent::preExecute();
    }

    public function execute()
    {
        if (! $this->failsValidation()) {

            $this->deleteRecord();
        }
    }

    protected function deleteRecord()
    {
        $descendants = $this->model()->getBrahnch($this->request['id']);

        $this->model()->deleteById(array_keys($descendants));
    }

    protected function requestInputs()
    {
        $this->request = [
            'id' => waRequest::request('id', null, waRequest::TYPE_INT)
        ];
    }

    protected function runValidation()
    {
        if (billboardValidation::notPositiveInt($this->request['id'])) {
            $this->errors[] = 'Недействительный идентификатор категории.';
        }
    }
}
