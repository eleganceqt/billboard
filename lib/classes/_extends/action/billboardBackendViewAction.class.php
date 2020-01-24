<?php

abstract class billboardBackendViewAction extends billboardViewAction
{
    protected function preExecute()
    {
        $this->setViewLayout();

        $this->setViewTitle();
    }

    protected function setViewLayout()
    {
        if (! $this->getRequest()->isXMLHttpRequest()) {
            $this->setLayout(new billboardBackendLayout());
        }
    }

    protected function setViewTitle()
    {
        wa()->getResponse()->setTitle($this->title);
    }
}
