<?php

class billboardFrontendAccountAdvertSortImagesController extends billboardFrontendAccountAdvertResourceController
{
    public function execute()
    {
        $this->updateImagesOrder();
    }

    protected function updateImagesOrder()
    {
        return (new billboardAdvertImagesModel())->updateOrder($this->getAdvertId(), $this->request['sort']);
    }

    protected function requestInputs()
    {
        $this->request = [
            'sort' => waRequest::request('sort', [], waRequest::TYPE_ARRAY)
        ];
    }
}
