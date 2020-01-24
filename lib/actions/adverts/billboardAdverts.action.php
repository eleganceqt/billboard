<?php

class billboardAdvertsAction extends billboardBackendViewAction
{
    use billboardCollectionable;
    use billboardPaginationable;

    protected $title = 'Объявления';

    /**
     * @inheritDoc
     */
    protected function preExecute()
    {
        parent::preExecute();

        $this->setCollection(new billboardAdvertCollection());
    }

    /**
     * @inheritDoc
     */
    public function execute()
    {
        $currentPage = $this->currentPage();

        $variables = [
            'adverts'     => $this->collection()
                                  ->page($currentPage)
                                  ->withCategories()
                                  ->withPartners()
                                  ->withCities()
                                  ->latest()
                                  ->items(),
            'totalPages'  => $this->collection()->pages(),
            'currentPage' => $currentPage,
        ];

        $this->assignMultiple($variables);
    }
}
