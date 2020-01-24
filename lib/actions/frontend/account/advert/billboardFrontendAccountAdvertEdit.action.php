<?php

class billboardFrontendAccountAdvertEditAction extends billboardFrontendAccountAdvertResourceAction
{
    public function execute()
    {
        $this->loadPreviewImages();

        $this->view()->assign('advert', $this->advert);

        $this->setMetadata();

        $this->setThemeTemplate('account/advert/AdvertEdit.html');
    }

    public function loadPreviewImages()
    {
        $images = (new billboardAdvertImagesModel())->getPreviewImages($this->advert['id']);

        $this->advert['images'] = $images;
    }

    protected function setMetadata()
    {
        $this->getResponse()->setTitle(waRequest::param('title', 'Редактировать объявление'));
//        $this->getResponse()->setMeta('keywords', waRequest::param('meta_keywords'));
//        $this->getResponse()->setMeta('description', waRequest::param('meta_description'));
    }
}
