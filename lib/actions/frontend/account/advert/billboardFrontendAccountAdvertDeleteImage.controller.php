<?php

class billboardFrontendAccountAdvertDeleteImageController extends billboardFrontendAccountAdvertResourceController
{
    /**
     * @var array
     */
    protected $image;

    /**
     * @throws waException
     */
    protected function preExecute()
    {
        $this->fetchAdvert();

        $this->fetchImage();

        if (! $this->advertExists() || ! $this->imageExists()) {
            $this->throwNotFound();
        }

        if (! $this->isMyAdvert()) {
            $this->throwForbidden();
        }

        parent::preExecute();
    }

    public function execute()
    {
        (new billboardAdvertImagesModel())->delete($this->getImageId());
    }

    protected function getImageId()
    {
        return waRequest::param('image_id', null, waRequest::TYPE_INT);
    }

    protected function fetchImage()
    {
        $this->image = (new billboardAdvertImagesModel())->getByField(['id' => $this->getImageId(), 'advert_id' => $this->getAdvertId()]);
    }

    protected function imageExists()
    {
        return billboardValidation::notBlank($this->image);
    }
}
