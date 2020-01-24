<?php

abstract class billboardBackendPaginationViewAction extends billboardBackendViewAction
{
    /**
     * @var billboardCollection
     */
    protected $collection;

    /**
     * @var int
     */
    protected $currentPage;

    /**
     * @var int
     */
    protected $perPage;

    protected function preExecute()
    {
        parent::preExecute();

        $this->setViewCollection();

        $this->initPagination();
    }

    protected function setViewCollection()
    {
//        $this->collection = new billboardCollection();
    }

    protected function initPagination()
    {
        $this->currentPage = $this->resolveCurrentPage();

        $this->perPage = $this->resolvePerPage();
    }

    public function collection()
    {
        return $this->collection;
    }

    public function currentPage()
    {
        $this->currentPage;
    }

    public function perPage()
    {
        return $this->perPage;
    }

    public function pages()
    {
        return (int) ceil($this->count() / $this->perPage());
    }

    public function resolveCurrentPage()
    {
        $page = waRequest::request('page', 1, waRequest::TYPE_INT);

        return billboardValidation::positiveInt($page) ? $page : 1;
    }

    public function resolvePerPage()
    {
        return $this->collection()->model()->perPage();
    }

    abstract public function items();

    abstract public function count();
}
