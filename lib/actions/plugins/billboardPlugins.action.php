<?php

class billboardPluginsAction extends billboardBackendViewAction
{
    protected $title = 'Плагины';

    public function execute()
    {
        $this->renderSidebar();
    }

    public function renderSidebar()
    {
        $this->view()->assign('sidebar', (new billboardPluginsSidebarAction())->render());
    }
}
