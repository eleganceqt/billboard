<?php

class billboardCitiesRefineController extends billboardJsonController
{
    use billboardCollectionable;
    use billboardPaginationable;

    /**
     * @inheritDoc
     */
    public function execute()
    {
        if (! $this->failsValidation()) {

            $this->setCollection(new billboardCityCollection());

            $currentPage = $this->request['page'];

            list($column, $direction) = array_values($this->request['sort']);

            $variables = [
                'cities'      => $this->collection()->search($this->request['query'])->page($currentPage)->withAdvertsCount()->sort($column, $direction)->items(),
                'totalPages'  => $this->collection()->pages(),
                'currentPage' => $currentPage,
                'sort'        => $this->request['sort']
            ];

            $this->response['content'] = (new billboardCitiesTableAction())->renderWith($variables);
        }
    }

    /**
     * @inheritDoc
     */
    protected function requestInputs()
    {
        $this->request = [
            'query' => waRequest::request('query', '', waRequest::TYPE_STRING_TRIM),
            'sort'  => [
                'column'    => waRequest::request('sort_column', null, waRequest::TYPE_STRING_TRIM),
                'direction' => waRequest::request('sort_direction', null, waRequest::TYPE_STRING_TRIM),
            ],
            'page'  => $this->currentPage()
        ];
    }
}
