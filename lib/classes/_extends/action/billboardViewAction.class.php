<?php

abstract class billboardViewAction extends waViewAction
{
    public function assignVariable($name, $value)
    {
        $this->view()->assign($name, $value);
    }

    public function assignMultiple($variables)
    {
        $this->view()->assign($variables);
    }

    public function render()
    {
        return $this->display(false);
    }

    public function renderWith($variables = [])
    {
        $this->preExecute();

        $this->execute();

        $this->afterExecute();

        $this->assignMultiple($variables);

        return $this->view()->fetch($this->template());
    }

    protected function view()
    {
        return $this->view;
    }

    protected function template()
    {
        return $this->template;
    }

    protected function loadTemplate($template)
    {
        $this->setTemplate($template);
    }

    protected function loadThemeTemplate($template)
    {
        $this->setThemeTemplate($template);
    }
}
