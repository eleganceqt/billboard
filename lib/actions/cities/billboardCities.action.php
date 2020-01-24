<?php

class billboardCitiesAction extends billboardBackendViewAction
{
    use billboardCollectionable;
    use billboardPaginationable;

    /**
     * @var string
     */
    protected $title = 'Города';

    /**
     * @inheritDoc
     */
    protected function preExecute()
    {
        parent::preExecute();

        $this->setCollection(new billboardCityCollection());
    }

    /**
     * @inheritDoc
     */
    public function execute()
    {
        $currentPage = $this->currentPage();

        $variables = [
            'cities'      => $this->collection()->page($currentPage)->withAdvertsCount()->sort(null, null)->items(),
            'totalPages'  => $this->collection()->pages(),
            'currentPage' => $currentPage,
        ];

        $this->assignMultiple($variables);
    }
}
