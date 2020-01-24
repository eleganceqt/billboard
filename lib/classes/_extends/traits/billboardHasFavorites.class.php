<?php

trait billboardHasFavorites
{
    /**
     * @var array
     */
    protected $favorites;

    public function favorites()
    {
        if (wa()->getUser()->isAuth()) {
            return $this->model('partnerFavorites')->getFavorites(wa()->getUser()->getId());
        }

        return [];
    }

    public function favoritesCount()
    {
        if (wa()->getUser()->isAuth()) {
            return $this->model('partnerFavorites')->countFavorites(wa()->getUser()->getId());
        }

        return 0;
    }

    public function inFavorites($advertId)
    {
        if ($this->favorites === null) {
            $this->favorites = $this->favorites();
        }

        return in_array($advertId, $this->favorites);
    }
}
