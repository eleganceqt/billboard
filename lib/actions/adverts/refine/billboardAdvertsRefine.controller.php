<?php

class billboardAdvertsRefineController extends billboardJsonController
{
    use billboardCollectionable;
    use billboardPaginationable;

    /**
     * @inheritDoc
     */
    public function execute()
    {
        if (! $this->failsValidation()) {

            $this->setCollection(new billboardAdvertCollection());

            $this->prepareCollection();

            $currentPage = $this->request['page'];

            list($column, $direction) = array_values($this->request['sort']);

            $variables = [
                'adverts'     => $this->collection()->page($currentPage)->sort($column, $direction)->items(),
                'totalPages'  => $this->collection()->pages(),
                'currentPage' => $currentPage,
                'sort'        => $this->request['sort']
            ];

            $this->response['content'] = (new billboardAdvertsTableAction())->renderWith($variables);
        }
    }

    protected function prepareCollection()
    {
        $this->collection()
             ->search($this->request['query'])
             ->byPartners($this->request['partners'])
             ->inCities($this->request['cities'])
             ->inCategories($this->request['categories'])
             ->withCategories()
             ->withPartners()
             ->withCities();
    }

    /**
     * @inheritDoc
     */
    protected function requestInputs()
    {
        $this->request = [
            'query'      => waRequest::request('query', '', waRequest::TYPE_STRING_TRIM),
            'partners'   => waRequest::request('partners', [], waRequest::TYPE_ARRAY_INT),
            'cities'     => waRequest::request('cities', [], waRequest::TYPE_ARRAY_INT),
            'categories' => waRequest::request('categories', [], waRequest::TYPE_ARRAY_INT),
            'sort'       => [
                'column'    => waRequest::request('sort_column', null, waRequest::TYPE_STRING_TRIM),
                'direction' => waRequest::request('sort_direction', null, waRequest::TYPE_STRING_TRIM),
            ],
            'page'       => $this->currentPage()
        ];
    }
}
