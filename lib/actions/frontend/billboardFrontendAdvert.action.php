<?php

class billboardFrontendAdvertAction extends billboardFrontendAction
{
    use billboardUseModels;

    /**
     * @var array
     */
    protected $advert;

    /**
     * @inheritDoc
     */
    protected function preExecute()
    {
        $this->setRouteEntity();
    }

    public function execute()
    {
        $this->setMetadata();

        $this->pushBreadcrumbs();

        $this->loadRelations();

        $this->incrementViews();

        $this->assignRouteEntity();

        $this->setThemeTemplate('advert.html');
    }

    public function setRouteEntity()
    {
        $this->advert = $this->findRouteEntity();
    }

    public function findRouteEntity()
    {
        $slug = waRequest::param('advert_id', null, waRequest::TYPE_INT);

        return $this->model('advert')->getRouteEntity($slug);
    }

    protected function setMetadata()
    {
        wa()->getResponse()->setTitle($this->advert['title']);
//        wa()->getResponse()->setMeta('keywords', $this->advert['meta_keywords']);
//        wa()->getResponse()->setMeta('description', $this->advert['meta_description']);
    }

    protected function pushBreadcrumbs()
    {
        parent::pushBreadcrumbs();

        $category = $this->model('category')->getById($this->advert['category_id']);

        if ($category['parent_id'] > 0) {

            $parents = array_reverse($this->model('category')->getPath($category['id']));

            foreach ($parents as $parent) {

                $this->breadcrumbs[] = [
                    'name' => $parent['name'],
                    'url'  => wa()->getRouteUrl('/frontend/category', ['category_url' => $parent['slug']])
                ];
            }
        }

        $this->breadcrumbs[] = [
            'name' => $category['name'],
            'url'  => wa()->getRouteUrl('/frontend/category', ['category_url' => $category['slug']])
        ];

        $this->breadcrumbs[] = [
            'name' => $this->advert['title'],
            'url'  => wa()->getRouteUrl('/frontend/advert', ['advert_id' => $this->advert['id']])
        ];
    }

    protected function loadRelations()
    {
        $this->loadCategory();

        $this->loadPartner();

        $this->loadCity();
    }

    protected function loadCategory()
    {
        $category = $this->model('category')->getById($this->advert['category_id']);

        $this->advert['category'] = $category;
    }

    protected function loadPartner()
    {
        $partner = new waContact($this->advert['partner_id']);

        $this->advert['partner'] = $partner;
    }

    protected function loadCity()
    {
        $city = $this->model('city')->getById($this->advert['city_id']);

        $this->advert['city'] = $city;
    }

    protected function incrementViews()
    {
        $this->model('advert')->incrementViews($this->advert['id']);
    }

    protected function assignRouteEntity()
    {
        $this->view()->assign('advert', $this->advert);
    }
}
