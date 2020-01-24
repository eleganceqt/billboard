<?php

class billboardCitiesTableAction extends billboardViewAction
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
        $path = billboardHelper::getAppPath('templates/actions/cities/partials/');

        $this->loadTemplate($path . 'table.html');
    }
}
