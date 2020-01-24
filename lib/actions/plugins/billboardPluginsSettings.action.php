<?php

class billboardPluginsSettingsAction extends billboardBackendViewAction
{
    public function execute()
    {
        $this->renderSidebar();

//        wa_dumpc(waRequest::param());

//        return false;
        $plugin_id = waRequest::param('id', null);

        wa_dumpc($plugin_id);
        $vars = array();
        if ($plugin_id) {
            $plugins       = $this->getConfig()->getPlugins();
            $plugins_count = count($plugins);
            if (isset($plugins[$plugin_id])) {
                $plugin    = waSystem::getInstance()->getPlugin($plugin_id, true);
                $namespace = wa()->getApp() . '_' . $plugin_id;

                $params                        = array();
                $params['id']                  = $plugin_id;
                $params['namespace']           = $namespace;
                $params['title_wrapper']       = '%s';
                $params['description_wrapper'] = '<br><span class="hint">%s</span>';
                $params['control_wrapper']     = '<div class="name">%s</div><div class="value">%s %s</div>';

                $settings_controls = $plugin->getControls($params);
                $this->getResponse()->setTitle(_w(sprintf('Plugin %s settings', $plugin->getName())));

                $vars['plugin_info'] = $plugins[$plugin_id];

                $vars['plugin_id']         = $plugin_id;
                $vars['settings_controls'] = $settings_controls;
            }
            waSystem::popActivePlugin();
        }
        $template              = $this->getTemplatePath('settings');
        $vars['plugins_count'] = $plugins_count;
//        $this->display($vars, $template);

        $this->setTemplate($template);

        $this->view->assign($vars);

//        (new waPluginsActions())->settingsAction();
    }


    protected function getTemplatePath($action = null)
    {
        $path = $this->getConfig()->getRootPath() . '/wa-system/plugin/templates/';
        if ($action == 'settings') {
            return $path . 'Settings.html';
        } else {
            return $path . 'Plugins.html';
        }
    }


    public function renderSidebar()
    {
        $this->view()->assign('sidebar', (new billboardPluginsSidebarAction())->render());
    }

    public function renderSettings()
    {
//        $this->view()->assign('content', )
    }
}
