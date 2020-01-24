<?php

class billboardCategoriesModalAction extends billboardViewAction
{
    protected function preExecute()
    {
        $this->loadCustomTemplate();
    }

    public function execute()
    {

    }

    protected function loadCustomTemplate()
    {
        $path = billboardHelper::getAppPath('templates/actions/categories/modal/');

        $this->loadTemplate($path . 'CategoriesModal.html');
    }
}
