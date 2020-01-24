<?php

abstract class billboardJsonController extends waJsonController
{
    protected $request = [];

    protected function preExecute()
    {
        if (! $this->isAuthorized()) {
            $this->forbidden();
        }

        $this->requestInputs();

        $this->runValidation();
    }

    protected function isAuthorized()
    {
        return true;
    }

    protected function forbidden()
    {
        throw new waRightsException(_w('Access denied'));
    }

    protected function requestInputs()
    {
        // ...
    }

    protected function runValidation()
    {
        // ...
    }

    protected function failsValidation()
    {
        return billboardValidation::notBlank($this->errors);
    }
}
