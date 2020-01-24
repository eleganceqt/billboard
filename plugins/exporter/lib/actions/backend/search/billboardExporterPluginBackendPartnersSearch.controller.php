<?php

class billboardExporterPluginBackendPartnersSearchController extends billboardJsonController
{
    public function execute()
    {
        $collection = new waContactsCollection('search/name*=' . $this->request['query']);

        $items = $collection->getContacts('*', 0, 10);

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
