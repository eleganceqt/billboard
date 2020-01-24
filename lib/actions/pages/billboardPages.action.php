<?php

class billboardPagesAction extends billboardBackendViewAction
{
    protected $title = 'Страницы';

    public function execute()
    {
        $this->renderSidebar();
    }

    public function renderSidebar()
    {
        $this->view()->assign('sidebar', (new billboardPagesSidebarAction())->render());
    }
}
