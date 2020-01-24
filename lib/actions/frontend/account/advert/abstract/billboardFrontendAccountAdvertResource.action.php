<?php

abstract class billboardFrontendAccountAdvertResourceAction extends billboardFrontendAction
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

        if ($this->isBlank()) {
            $this->throwNotFound();
        }

        if (! $this->imOwner()) {
            $this->throwForbidden();
        }
    }

    /**
     * @return int
     */
    protected function getId()
    {
        return waRequest::param('advert_id', null, waRequest::TYPE_INT);
    }

    /**
     * @return void
     */
    protected function fetchAdvert()
    {
        $this->advert = (new billboardAdvertModel())->getById($this->getId());
    }

    /**
     * @return bool
     */
    protected function isBlank()
    {
        return billboardValidation::blank($this->advert);
    }

    /**
     * @return bool
     */
    protected function imOwner()
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
