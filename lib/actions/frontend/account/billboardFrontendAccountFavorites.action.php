<?php

class billboardFrontendAccountFavoritesAction extends billboardFrontendAction
{
    use billboardUseModels;
    use billboardCollectionable;
    use billboardPaginationable;

    /**
     * @inheritDoc
     */
    protected function preExecute()
    {
        $this->setCollection(new billboardAdvertCollection());

        $this->setupCollection();
    }

    public function execute()
    {
        $this->assignCollectionItems();

        $this->setMetadata();
        
        $this->setThemeTemplate('account/AccountFavorites.html');
    }

    protected function assignCollectionItems()
    {
        $currentPage = $this->currentPage();

        $variables = [
            'adverts'     => $this->collection()->page($currentPage)->items(),
            'totalPages'  => $this->collection()->pages(),
            'currentPage' => $currentPage,
        ];

//        billboardVarDumper::dump($variables['adverts']);

        $this->assignMultiple($variables);
    }

    protected function setupCollection()
    {
        $this
            ->collection()
            ->favorites()
            ->withCategories()
            ->latest()
            ->active();
    }

    protected function setMetadata()
    {
        $this->getResponse()->setTitle(waRequest::param('title', 'Избранные'));
//        $this->getResponse()->setMeta('keywords', waRequest::param('meta_keywords'));
//        $this->getResponse()->setMeta('description', waRequest::param('meta_description'));
    }
}
