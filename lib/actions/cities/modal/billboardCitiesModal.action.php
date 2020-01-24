<?php

class billboardCitiesModalAction extends billboardViewAction
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
        $path = billboardHelper::getAppPath('templates/actions/cities/modal/');

        $this->loadTemplate($path . 'CitiesModal.html');
    }
}
