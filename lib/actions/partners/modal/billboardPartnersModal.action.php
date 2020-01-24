<?php

class billboardPartnersModalAction extends billboardViewAction
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
        $path = billboardHelper::getAppPath('templates/actions/partners/modal/');

        $this->loadTemplate($path . 'PartnersModal.html');
    }
}
