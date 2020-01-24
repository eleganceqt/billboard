<?php

class billboardPluginsSidebarAction extends billboardViewAction
{
    public function execute()
    {
        $this->view()->assign('plugins', $this->getConfig()->getPlugins());
    }
}
