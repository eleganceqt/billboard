<?php

class billboardFrontendAccountAdvertsAction extends billboardFrontendAction
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

        $this->setThemeTemplate('account/AccountAdverts.html');
    }

    protected function assignCollectionItems()
    {
        $currentPage = $this->currentPage();

        $variables = [
            'adverts'     => $this->collection()->page($currentPage)->items(),
            'totalPages'  => $this->collection()->pages(),
            'currentPage' => $currentPage,
        ];

        $this->assignMultiple($variables);

    }

    protected function setupCollection()
    {
        $this
            ->collection()
            ->partner(wa()->getUser()->getId())
            ->withCategories()
            ->latest();
    }

    protected function setMetadata()
    {
        $this->getResponse()->setTitle(waRequest::param('title', 'Мои объявления'));
//        $this->getResponse()->setMeta('keywords', waRequest::param('meta_keywords'));
//        $this->getResponse()->setMeta('description', waRequest::param('meta_description'));
    }
}
