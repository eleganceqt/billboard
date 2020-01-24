<?php

class billboardFrontendAccountAdvertShowController extends billboardFrontendAccountAdvertResourceController
{
    use billboardUseModels;

    public function execute()
    {
        $this->model('advert')->setVisible($this->getAdvertId());
    }
}
