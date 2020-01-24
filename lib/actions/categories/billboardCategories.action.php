<?php

class billboardCategoriesAction extends billboardBackendViewAction
{
    protected $title = 'Категории';

    public function execute()
    {
        $categories = (new billboardCategoryModel())->fTree();

        $this->view()->assign(compact('categories'));
    }
}
