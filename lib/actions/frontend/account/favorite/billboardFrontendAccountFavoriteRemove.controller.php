<?php

class billboardFrontendAccountFavoriteRemoveController extends billboardJsonController
{
    use billboardUseModels;

    /**
     * @var array
     */
    protected $advert;

    /**
     * @throws waException
     */
    protected function preExecute()
    {
        $this->fetchAdvert();

        if (! $this->advertExists()) {
            $this->throwNotFound();
        }

        parent::preExecute();
    }

    public function execute()
    {
        $partnerId = wa()->getUser()->getId();

        $this->model('partnerFavorites')->remove($partnerId, $this->getAdvertId());
    }

    /**
     * @return int
     */
    protected function getAdvertId()
    {
        return waRequest::param('advert_id', null, waRequest::TYPE_INT);
    }

    /**
     * @return void
     */
    protected function fetchAdvert()
    {
        $this->advert = (new billboardAdvertModel())->getById($this->getAdvertId());
    }

    /**
     * @return bool
     */
    protected function advertExists()
    {
        return billboardValidation::notBlank($this->advert);
    }

    /**
     * @throws waException
     */
    protected function throwNotFound()
    {
        throw new waException('', 404);
    }
}
