<?php

class billboardPagesEditAction extends billboardBackendViewAction
{
    public function execute()
    {
        $this->renderSidebar();
    }

    public function renderSidebar()
    {
        $this->view()->assign('sidebar', (new billboardPagesSidebarAction())->render());
    }
}
