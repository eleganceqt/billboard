<?php

class billboardFrontendSearchAction extends billboardFrontendAction
{
    use billboardCollectionable;
    use billboardPaginationable;

    protected function preExecute()
    {
        $this->buildParams();

        $this->setCollection(new billboardAdvertCollection());

        $this->setupCollection();
    }

    public function execute()
    {

//        wa_dumpc(
//            $this->params
//        );

        $currentPage = $this->currentPage();

        $variables = [
            'adverts'     => $this->collection()->page($currentPage)->items(),
            'totalPages'  => $this->collection()->pages(),
            'currentPage' => $currentPage,
        ];

//        billboardVarDumper::dump($variables['adverts']);

        $this->assignMultiple($variables);

        $this->setMetadata();

        $this->setThemeTemplate('search.html');
    }

    protected function buildParams()
    {
        $this->params = [
            'query'       => waRequest::request('query', null, waRequest::TYPE_STRING_TRIM),
            'category_id' => waRequest::request('category_id', null, waRequest::TYPE_INT),
            'city_id'     => waRequest::request('city_id', null, waRequest::TYPE_INT),
            'price'       => [
                'from' => waRequest::request('price_from', null, waRequest::TYPE_INT),
                'to'   => waRequest::request('price_to', null, waRequest::TYPE_INT),
            ]
        ];
    }

    protected function setupCollection()
    {
        $this
            ->collection()
            ->search($this->params['query'])
            ->branch($this->params['category_id'])
//            ->category($this->params['category_id'])
            ->city($this->params['city_id'])
            ->price($this->params['price']['from'], $this->params['price']['to'])
            ->withCategories()
            ->latest()
            ->active();
    }

    protected function setMetadata()
    {
        $this->getResponse()->setTitle(waRequest::param('title', 'Поиск'));
//        $this->getResponse()->setMeta('keywords', waRequest::param('meta_keywords'));
//        $this->getResponse()->setMeta('description', waRequest::param('meta_description'));
    }
}
