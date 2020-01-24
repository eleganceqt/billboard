<?php

class billboardBackendLayout extends waLayout
{
    public function execute()
    {
        $this->renderSidebar();
    }

    public function renderSidebar()
    {
        $this->executeAction('sidebar', new billboardBackendSidebarAction());
    }
}
