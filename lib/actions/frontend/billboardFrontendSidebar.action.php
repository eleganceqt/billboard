<?php

class billboardFrontendSidebarAction extends billboardFrontendAction
{
    /**
     * @inheritDoc
     */
    public function execute()
    {
        $this->setThemeTemplate('sidebar.html');
    }
}
