<?php

trait billboardPaginationable
{
    /**
     * @var int
     */
    protected $currentPage;

    /**
     * @return int
     */
    public function currentPage()
    {
        if (billboardValidation::blank($this->currentPage)) {
            $this->currentPage = $this->resolveCurrentPage();
        }

        return $this->currentPage;
    }

    /**
     * @return int
     */
    public function resolveCurrentPage()
    {
        $page = waRequest::request('page', 1, waRequest::TYPE_INT);

        return billboardValidation::positiveInt($page) ? $page : 1;
    }
}
