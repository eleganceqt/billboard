<?php

class billboardPartnersAction extends billboardBackendViewAction
{
    use billboardUseModels;
    use billboardPaginationable;

    protected $title = 'Партнёры';

    public function execute()
    {
        $collection = new waContactsCollection();

        $currentPage = $this->currentPage();

        $limit      = $this->limit();
        $count      = $collection->count();
        $totalPages = (int) ceil($count / $limit);

        $partners = $collection->getContacts('*', 0, $limit);

        $this->formatPhone($partners);

        $this->loadCount($partners);

        $variables = [
            'partners'    => $partners,
            'totalPages'  => $totalPages,
            'currentPage' => $currentPage,
        ];

        $this->assignMultiple($variables);
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
}
