<?php

class billboardCategoriesCreateController extends billboardJsonController
{
    /**
     * @inheritDoc
     */
    public function execute()
    {
        $category = billboardCategoryModel::mock();

        if ($parentId = waRequest::request('parent_id', null, waRequest::TYPE_INT)) {
            $category['parent_id'] = $parentId;
        }

        $this->response['content'] = (new billboardCategoriesModalAction())->renderWith(compact('category'));
    }
}
