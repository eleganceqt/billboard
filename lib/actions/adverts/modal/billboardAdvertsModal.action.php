<?php

class billboardAdvertsModalAction extends billboardViewAction
{
    public function execute()
    {
        $path = billboardHelper::getAppPath('templates/actions/adverts/modal/');

        $this->setTemplate($path . 'AdvertsModal.html');
    }
}
