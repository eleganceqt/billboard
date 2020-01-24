<?php

class billboardFrontendAccountAdvertHideController extends billboardFrontendAccountAdvertResourceController
{
    use billboardUseModels;

    public function execute()
    {
        $this->model('advert')->setHidden($this->getAdvertId());
    }
}
