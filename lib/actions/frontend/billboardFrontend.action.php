<?php

class billboardFrontendAction extends billboardViewAction
{
    /**
     * @var array
     */
    protected $breadcrumbs = [];

    /**
     * @inheritDoc
     */
    public function __construct($params = null)
    {
        parent::__construct($params);

        if (! waRequest::isXMLHttpRequest()) {
            $this->setLayout(new billboardFrontendLayout());
        }
    }

    /**
     * @inheritDoc
     */
    public function execute()
    {
        if (wa()->getRouting()->getCurrentUrl()) {
            throw new waException(_ws('Page not found'), 404);
        }

        $this->setMetadata();

        $this->pushBreadcrumbs();

        $this->setThemeTemplate('home.html');
    }

    /**
     * @inheritDoc
     */
    protected function afterExecute()
    {
        $this->view()->assign('breadcrumbs', $this->breadcrumbs);
    }

    /**
     * @inheritDoc
     */
    public function display($clear_assign = true)
    {
        // set globals
        $params = waRequest::param();
        foreach ($params as $k => $v) {
            if (in_array($k, array('url', 'module', 'action', 'meta_keywords', 'meta_description', 'private',
                                   'url_type', 'type_id', 'payment_id', 'shipping_id', 'currency', 'stock_id', 'public_stocks'))) {
                unset($params[$k]);
            }
        }
        $this->view()->getHelper()->globals($params);

        try {
            return parent::display(false);
        } catch (waException $e) {
            if ($e->getCode() == 404) {
                $url = $this->getConfig()->getRequestUrl(false, true);
                if (substr($url, -1) !== '/' && strpos(substr($url, -5), '.') === false) {
                    wa()->getResponse()->redirect($url . '/', 301);
                }
            }
            /**
             * @event frontend_error
             */
            wa()->event('frontend_error', $e);
            $this->view()->assign('error_message', $e->getMessage());
            $code = $e->getCode();
            $this->view()->assign('error_code', $code);
            $this->getResponse()->setStatus($code ? $code : 500);
            $this->setThemeTemplate('error.html');

            return $this->view()->fetch($this->getTemplate());
        }
    }

    protected function setMetadata()
    {
        $this->getResponse()->setTitle(waRequest::param('title', 'Главная'));
        $this->getResponse()->setMeta('keywords', waRequest::param('meta_keywords'));
        $this->getResponse()->setMeta('description', waRequest::param('meta_description'));
    }

    /**
     * @return void
     */
    protected function pushBreadcrumbs()
    {
        $this->breadcrumbs[] = [
            'name' => 'Главная',
            'url'  => wa()->getRouteUrl('billboard/frontend')
        ];
    }
}
