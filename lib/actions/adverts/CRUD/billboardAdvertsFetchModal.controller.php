<?php

class billboardAdvertsFetchModalController extends billboardJsonController
{
    public function execute()
    {
        $this->response['modalContent'] = (new billboardAdvertsModalAction())->render();
    }
}
