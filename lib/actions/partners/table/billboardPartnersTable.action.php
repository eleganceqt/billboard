<?php

class billboardPartnersTableAction extends billboardViewAction
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
        $path = billboardHelper::getAppPath('templates/actions/partners/partials/');

        $this->loadTemplate($path . 'table.html');
    }
}
