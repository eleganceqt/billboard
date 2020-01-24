<?php

class billboardFrontendCategoryAction extends billboardFrontendAction
{
    use billboardUseModels;
    use billboardCollectionable;
    use billboardPaginationable;

    /**
     * @var array
     */
    protected $category;

    /**
     * @inheritDoc
     */
    protected function preExecute()
    {
        $this->setRouteEntity();

        $this->setCollection(new billboardAdvertCollection());

        $this->setupCollection();
    }

    /**
     * @inheritDoc
     */
    public function execute()
    {
        $this->setMetadata();

        $this->pushBreadcrumbs();

        $this->assignRouteEntity();

        $this->assignCollectionItems();

        $this->setThemeTemplate('category.html');
    }

    public function setRouteEntity()
    {
        $this->category = $this->findRouteEntity();
    }

    public function findRouteEntity()
    {
        $slug = waRequest::param('category_url', null, waRequest::TYPE_STRING_TRIM);

        return $this->model('category')->getRouteEntity($slug);
    }

    protected function setMetadata()
    {
        wa()->getResponse()->setTitle($this->category['title']);
        wa()->getResponse()->setMeta('keywords', $this->category['meta_keywords']);
        wa()->getResponse()->setMeta('description', $this->category['meta_description']);
    }

    protected function pushBreadcrumbs()
    {
        parent::pushBreadcrumbs();

        $this->category['root_id'] = $this->category['id'];

        if ($this->category['parent_id'] > 0) {

            $parents = array_reverse($this->model('category')->getPath($this->category['id']));

            $rootCategory = reset($parents);

            $this->category['root_id'] = $rootCategory['id'];

            foreach ($parents as $parent) {

                $this->breadcrumbs[] = [
                    'name' => $parent['name'],
                    'url'  => wa()->getRouteUrl('/frontend/category', ['category_url' => $parent['slug']])
                ];
            }
        }

        $this->breadcrumbs[] = [
            'name' => $this->category['name'],
            'url'  => wa()->getRouteUrl('/frontend/category', ['category_url' => $this->category['slug']])
        ];
    }

    protected function assignRouteEntity()
    {
        $this->view()->assign('category', $this->category);
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
            ->category($this->category['id'])
            ->withCategories()
            ->latest()
            ->active();
    }
}
