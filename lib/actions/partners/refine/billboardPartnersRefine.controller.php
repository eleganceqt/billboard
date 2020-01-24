<?php

class billboardPartnersRefineController extends billboardJsonController
{
    use billboardUseModels;
    use billboardCollectionable;
    use billboardPaginationable;

    /**
     * @inheritDoc
     */
    public function execute()
    {
        if (! $this->failsValidation()) {

            $collection = new waContactsCollection('search/name*=' . $this->request['query']);

            $currentPage = $this->request['page'];

            $limit      = $this->limit();
            $offset     = ($currentPage - 1) * $limit;
            $count      = $collection->count();
            $totalPages = (int) ceil($count / $limit);

            $partners = $collection->getContacts('*', $offset, $limit);

            $this->formatPhone($partners);

            $this->loadCount($partners);

            list($column, $direction) = array_values($this->request['sort']);

            $variables = [
                'partners'    => $partners,
                'totalPages'  => $totalPages,
                'currentPage' => $currentPage,
                'sort'        => $this->request['sort']
            ];

            $this->response['content'] = (new billboardPartnersTableAction())->renderWith($variables);
        }
    }

    protected function limit()
    {
        $limit = billboardHelper::getConfigOption('backend_partners_per_page');

        return billboardValidation::notBlank($limit) ? (int) $limit : billboardPartnerModel::PER_PAGE;
    }

    protected function formatPhone(&$partners)
    {
        foreach ($partners as &$partner) {

            $formatter = new waContactPhoneFormatter();


            if ($partner['phone'] !== false) {
                foreach ($partner['phone'] as &$phone) {
                    $phone['formatted'] = $formatter->format($phone['value']);
                }
            }
        }
    }

    protected function loadCount(&$partners)
    {
        $counts = $this->model('advert')->countByPartners(array_keys($partners));

        foreach ($partners as &$partner) {

            $partner['active_count'] = 0;
            $partner['total_count']  = 0;

            if (! empty($counts[$partner['id']])) {
                $partner['active_count'] = $counts[$partner['id']]['active_count'];
                $partner['total_count']  = $counts[$partner['id']]['total_count'];
            }
        }
    }

    /**
     * @inheritDoc
     */
    protected function requestInputs()
    {
        $this->request = [
            'query' => waRequest::request('query', '', waRequest::TYPE_STRING_TRIM),
            'sort'  => [
                'column'    => waRequest::request('sort_column', null, waRequest::TYPE_STRING_TRIM),
                'direction' => waRequest::request('sort_direction', null, waRequest::TYPE_STRING_TRIM),
            ],
            'page'  => $this->currentPage()
        ];
    }
}
