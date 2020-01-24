<?php

class billboardFrontendAccountAdvertDeleteController extends billboardFrontendAccountAdvertResourceController
{
    use billboardUseModels;

    public function execute()
    {
        $this->model('advert')->delete($this->getAdvertId());
    }
}
