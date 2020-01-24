<?php

class billboardCategoriesFetchModalController extends billboardJsonController
{

    public function execute()
    {
        sleep(1.5);

        $this->response['content'] = (new billboardCategoriesModalAction())->render();
    }

    protected function requestInputs()
    {
        $this->request = [
            'parent_id' => waRequest::request('parent_id', 0, waRequest::TYPE_INT)
        ];
    }

    protected function runValidation()
    {
//        if (billboardValidation::positiveInt($this->request['parent_id'])) {
//            $this->errors[] = 'err';
//        }
    }
}
