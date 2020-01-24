<?php

abstract class billboardFrontendAccountAdvertResourceController extends billboardJsonController
{
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

        if (! $this->isMyAdvert()) {
            $this->throwForbidden();
        }

        parent::preExecute();
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
     * @return bool
     */
    protected function isMyAdvert()
    {
        return (int) $this->advert['partner_id'] === (int) wa()->getUser()->getId();
    }

    /**
     * @throws waException
     */
    protected function throwNotFound()
    {
        throw new waException('', 404);
    }

    /**
     * @throws waException
     */
    protected function throwForbidden()
    {
        throw new waException('', 403);
    }
}
