<?php

class billboardExporterPluginBackendCitiesSearchController extends billboardJsonController
{
    public function execute()
    {
        $items = (new billboardCityCollection())->search($this->request['query'])->sort(null, null)->take(10)->items();

        foreach ($items as &$item) {
            $item['value'] = $item['id'];
        }

        $this->prependExportAll($items);

        $this->response['results'] = $items;
    }

    protected function prependExportAll(&$items)
    {
        $item = [
            'name'  => 'Все',
            'value' => 'all',
        ];

        array_unshift($items, $item);
    }

    protected function requestInputs()
    {
        $this->request = [
            'query' => waRequest::request('query', '', waRequest::TYPE_STRING_TRIM)
        ];
    }
}
