<?php

class billboardExporterPluginBackendAdvertsSearchController extends billboardJsonController
{
    public function execute()
    {
        $items = (new billboardAdvertCollection())->search($this->request['query'])->take(10)->latest()->items();

        foreach ($items as &$item) {
            $item['name']  = $item['title'];
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
