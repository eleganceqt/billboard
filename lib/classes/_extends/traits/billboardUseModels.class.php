<?php

trait billboardUseModels
{
    /**
     * @var array
     */
    protected $models = [];

    protected function model($model)
    {
        if (isset($this->models[$model])) {
            return $this->models[$model];
        }

        $class = $this->buildQualifiedName($model);

        $this->models[$model] = new $class();

        return $this->models[$model];
    }

    private function buildQualifiedName($model)
    {
        return 'billboard' . ucfirst($model) . 'Model';
    }
}
