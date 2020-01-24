<?php

class billboardCategoriesMoveController extends billboardJsonController
{
    use billboardModelable;
    use billboardSupportable;

    protected function preExecute()
    {
        $this->setModel(new billboardCategoryModel());

        parent::preExecute();
    }

    public function execute()
    {
        if (! $this->failsValidation()) {

            $this->moveRecord();
        }
    }

    protected function moveRecord()
    {
        $this->model()->move($this->request['id'], $this->request['parent_id'], $this->request['before_id']);
    }

    protected function requestInputs()
    {
        $this->request = [
            'id'        => waRequest::request('id', null, waRequest::TYPE_INT),
            'parent_id' => waRequest::request('parent_id', null, waRequest::TYPE_INT),
            'before_id' => waRequest::request('before_id', null, waRequest::TYPE_INT)
        ];
    }

    protected function runValidation()
    {
        if (billboardValidation::notPositiveInt($this->request['id'])) {
            $this->errors[] = '';
        }

        if (billboardValidation::notPositiveInt($this->request['parent_id'])) {
            $this->errors[] = '';
        }

        if (billboardValidation::notPositiveInt($this->request['before_id'])) {
            $this->errors[] = '';
        }
    }
}
