<?php

class billboardAdvertsTableAction extends billboardViewAction
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
        $path = billboardHelper::getAppPath('templates/actions/adverts/partials/');

        $this->loadTemplate($path . 'table.html');
    }
}
