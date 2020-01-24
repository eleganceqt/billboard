<?php

require waConfig::get('wa_path_root') . '/wa-apps/billboard/lib/vendors/vendor/autoload.php';

class billboardConfig extends waAppConfig
{

    public function index()
    {

    }

    protected function getRoutingRules($route = array())
    {
        $routes = array();
        if ($this->getEnvironment() === 'backend') {
            $path = $this->getRoutingPath('backend');
            if (file_exists($path)) {
                $routes = array_merge($routes, include($path));
            }
        }

        if ($this->getEnvironment() === 'frontend') {
            $path = $this->getRoutingPath('frontend');
            if (file_exists($path)) {
                $routes = array_merge($routes, include($path));
            }
        }

        return array_merge($this->getPluginRoutes($route), $routes);
    }
}

function billboard_currency($number)
{
    return waCurrency::format('%{s}', $number, 'RUB');
}

function billboard_currency_html($number)
{
    return waCurrency::format('%{h}', $number, 'RUB');
}
