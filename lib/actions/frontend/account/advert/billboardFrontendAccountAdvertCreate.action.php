<?php

class billboardFrontendAccountAdvertCreateAction extends billboardFrontendAction
{
    public function execute()
    {
        $this->setMetadata();

        $this->setThemeTemplate('account/advert/AdvertCreate.html');
    }
    
    protected function setMetadata()
    {
        $this->getResponse()->setTitle(waRequest::param('title', 'Добавить объявление'));
//        $this->getResponse()->setMeta('keywords', waRequest::param('meta_keywords'));
//        $this->getResponse()->setMeta('description', waRequest::param('meta_description'));
    }
}
