<?php

class billboardBackendSidebarAction extends billboardViewAction
{
    use billboardUseModels;

    public function execute()
    {
        $counts = [
            'adverts'    => $this->model('advert')->countAll(),
            'partners'   => (new waContactsCollection())->count(),
            'categories' => $this->model('category')->countAll(),
            'cities'     => $this->model('city')->countAll(),
            'pages'      => 0,//$this->model('city')->countAll(),
            'plugins'    => count($this->getConfig()->getPlugins()),//$this->model('city')->countAll(),
        ];

        $this->view()->assign(compact('counts'));
    }
}
