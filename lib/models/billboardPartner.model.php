<?php

class billboardPartnerModel //extends billboardModel
{
    protected $table = '';

    const PER_PAGE = 10;

    public function getById($id)
    {
        return (new waContactModel())->getById($id);
    }

    
}
