<?php

class billboardViewHelper extends waAppViewHelper
{
    use billboardUseModels;
    use billboardHasFavorites;
    use billboardSupportable;

    const RECTANGULAR_IMAGES_CATEGORIES = [20];

    /**
     * Returns partners list.
     *
     * @return array
     */
    public function partners()
    {
        $collection = new waContactsCollection();

        return ($collection)->getContacts('*', 0, $collection->count());
    }

    /**
     * Returns active categories as list.
     *
     * @return array
     */
    public function categories()
    {
        return $this->model('category')->all();
    }

    /**
     * Returns cities list.
     *
     * @return array
     */
    public function cities()
    {
        return $this->model('city')->all();
    }

    /**
     * Returns active root categories.
     *
     * @return array
     */
    public function rootCategories()
    {
        return $this->model('category')->rootCategories();
    }

    /**
     * Returns childs (first level descendants) of given category.
     *
     * @param int $categoryId
     *
     * @return array
     */
    public function childCategories($categoryId)
    {
        return $this->model('category')->childCategories($categoryId);
    }

    /**
     * Returns all images of a given advert with given size.
     *
     * @param int $advertId
     * @param string $size
     *
     * @return array
     */
    public function advertImages($advertId, $size = '970x0')
    {
        return $this->model('advertImages')->getByAdvert($advertId, $size);
    }

    /**
     * Returns main images for given adverts.
     *
     * @param array $keys
     * @param string $size
     *
     * @return mixed
     */
    public function advertsMainImages($keys, $size = '970x0')
    {
        return $this->model('advertImages')->getMainImages($keys, $size);
    }

    /**
     * Determine if you're on accout page.
     *
     * @return bool
     */
    public function isAccountPage()
    {
        $action = waRequest::param('action', '', waRequest::TYPE_STRING_TRIM);

        return $this->startsWith('account', $action);
    }

    public function splitAdvertsByImage(&$adverts)
    {
        $keys = [
            'square'      => [],
            'rectangular' => []
        ];

        foreach ($adverts as $advert) {

            if (in_array($advert['category_id'], self::RECTANGULAR_IMAGES_CATEGORIES)) {
                $keys['rectangular'][] = $advert['id'];
            } else {
                $keys['square'][] = $advert['id'];
            }

        }

        return $keys;
    }

    public function latestAdverts($offset = 0, $limit = 10)
    {
        return (new billboardAdvertCollection())
            ->withCategories()
            ->skip($offset)
            ->take($limit)
            ->latest()
            ->active()
            ->items();
    }

    public function recommendedAdverts($advert, $offset = 0, $limit = 10)
    {
        return (new billboardAdvertCollection())
            ->category($advert['category_id'])
            ->withCategories()
            ->skip($offset)
            ->take($limit)
            ->mostViewed()
            ->except($advert['id'])
            ->latest()
            ->active()
            ->items();
    }

}
