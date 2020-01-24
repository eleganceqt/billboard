<?php

class billboardAdvertCollection extends billboardCollection
{
    public function search($query)
    {
        if (billboardValidation::notBlank($query)) {

            if (billboardValidation::notBlank($this->builder()->wheres)) {
                $this->builder()->andWhereLike('title', '%' . $this->model()->escapeLike($query) . '%');
            } else {
                $this->builder()->whereLike('title', '%' . $this->model()->escapeLike($query) . '%');
            }
        }

        return $this;
    }

    public function sort($column, $direction)
    {
        $column = billboardValidation::notBlank($column) ? $column : 'create_datetime';

        $direction = billboardValidation::notBlank($direction) ? $direction : 'desc';

        return parent::sort($column, $direction);
    }

    public function branch($categoryId)
    {
        $descendants = array_keys((new billboardCategoryModel())->getBrahnch($categoryId));

        if (billboardValidation::notBlank($descendants)) {

            if (billboardValidation::notBlank($this->builder()->wheres)) {
                $this->builder()->andWhereIn('category_id', $descendants);
            } else {
                $this->builder()->whereIn('category_id', $descendants);
            }

        }

        return $this;
    }

    public function category($categoryId)
    {
        if (billboardValidation::positiveInt($categoryId)) {

            if (billboardValidation::notBlank($this->builder()->wheres)) {
                $this->builder()->andWhere('category_id', '=', $categoryId);
            } else {
                $this->builder()->where('category_id', '=', $categoryId);
            }

        }

        return $this;
    }

    public function partner($partnerId)
    {
        if (billboardValidation::positiveInt($partnerId)) {

            if (billboardValidation::notBlank($this->builder()->wheres)) {
                $this->builder()->andWhere('partner_id', '=', $partnerId);
            } else {
                $this->builder()->where('partner_id', '=', $partnerId);
            }

        }

        return $this;
    }

    public function city($cityId)
    {
        if (billboardValidation::positiveInt($cityId)) {

            if (billboardValidation::notBlank($this->builder()->wheres)) {
                $this->builder()->andWhere('city_id', '=', $cityId);
            } else {
                $this->builder()->where('city_id', '=', $cityId);
            }
        }

        return $this;
    }

    public function byPartners($partners)
    {
        if (billboardValidation::notBlank($partners)) {

            if (billboardValidation::notBlank($this->builder()->wheres)) {
                $this->builder()->andWhereIn('partner_id', $partners);
            } else {
                $this->builder()->whereIn('partner_id', $partners);
            }
        }

        return $this;
    }

    public function inCities($cities)
    {
        if (billboardValidation::notBlank($cities)) {

            if (billboardValidation::notBlank($this->builder()->wheres)) {
                $this->builder()->andWhereIn('city_id', $cities);
            } else {
                $this->builder()->whereIn('city_id', $cities);
            }
        }

        return $this;
    }

    public function inCategories($categories)
    {
        if (billboardValidation::notBlank($categories)) {

            if (billboardValidation::notBlank($this->builder()->wheres)) {
                $this->builder()->andWhereIn('category_id', $categories);
            } else {
                $this->builder()->whereIn('category_id', $categories);
            }
        }

        return $this;
    }

    // dd/mm/yyyy - 22/10/2019
    public function from($date)
    {
        if (billboardValidation::notBlank($date)) {

            if (billboardValidation::notBlank($this->builder()->wheres)) {
                $this->builder()->andWhere("DATE_FORMAT(`create_datetime`, '%d/%m/%Y')", '>=', $date);
            } else {
                $this->builder()->where("DATE_FORMAT(`create_datetime`, '%d/%m/%Y')", '>=', $date);
            }

        }

        return $this;
    }

    // dd/mm/yyyy - 22/10/2019
    public function to($date)
    {
        if (billboardValidation::notBlank($date)) {

            if (billboardValidation::notBlank($this->builder()->wheres)) {
                $this->builder()->andWhere("DATE_FORMAT(`create_datetime`, '%d/%m/%Y')", '<=', $date);
            } else {
                $this->builder()->where("DATE_FORMAT(`create_datetime`, '%d/%m/%Y')", '<=', $date);
            }
        }

        return $this;
    }

    public function in($keys)
    {
        if (billboardValidation::notBlank($keys)) {

            if (billboardValidation::notBlank($this->builder()->wheres)) {
                $this->builder()->andWhereIn('id', $keys);
            } else {
                $this->builder()->whereIn('id', $keys);
            }
        }

        return $this;
    }

    public function price($from, $to)
    {
        if (billboardValidation::positiveInt($from)) {

            if (billboardValidation::notBlank($this->builder()->wheres)) {
                $this->builder()->andWhere('price', '>=', $from);
            } else {
                $this->builder()->where('price', '>=', $from);
            }

        }

        if (billboardValidation::positiveInt($to)) {

            if (billboardValidation::notBlank($this->builder()->wheres)) {
                $this->builder()->andWhere('price', '<=', $to);
            } else {
                $this->builder()->where('price', '<=', $to);
            }
        }

        return $this;
    }

    public function mostViewed()
    {
        $this->sort('views', 'desc');

        return $this;
    }

    public function except($advertId)
    {
        if (billboardValidation::positiveInt($advertId)) {

            if (billboardValidation::notBlank($this->builder()->wheres)) {
                $this->builder()->andWhere('id', '!=', $advertId);
            } else {
                $this->builder()->where('id', '!=', $advertId);
            }

        }

        return $this;
    }

    public function favorites()
    {
        $this->builder()->select(['billboard_advert.*']);

        $partnerId = wa()->getUser()->getId();

        if ($partnerId === null) {
            $condition = ['billboard_partner_favorites.partner_id', 'IS NULL', null, 'column', 'AND'];
        }

        if (billboardValidation::positiveInt($partnerId)) {
            $condition = ['billboard_partner_favorites.partner_id', '=', $partnerId, 'value', 'AND'];
        }

        $this->builder()->innerJoin('billboard_partner_favorites', 'billboard_advert.id', '=', 'billboard_partner_favorites.advert_id', [$condition]);

        return $this;
    }

    public function latest()
    {
        $this->sort('create_datetime', 'desc');

        return $this;
    }

    public function active()
    {
        if (billboardValidation::notBlank($this->builder()->wheres)) {
            $this->builder()->andWhere('status', '=', billboardAdvertModel::STATUS_ON);
        } else {
            $this->builder()->where('status', '=', billboardAdvertModel::STATUS_ON);
        }

        return $this;
    }

    public function limit()
    {
        $limit = billboardValidation::notBlank($this->builder()->limit) ? $this->builder()->limit : billboardHelper::getConfigOption($this->getEnv() . '_adverts_per_page');

        return billboardValidation::notBlank($limit) ? (int) $limit : $this->model()->perPage();
    }

    public function withCategories()
    {
        $this->relations[] = 'categories';

        return $this;
    }

    public function withPartners()
    {
        $this->relations[] = 'partners';

        return $this;
    }

    public function withCities()
    {
        $this->relations[] = 'cities';

        return $this;
    }

    public function withImages()
    {
        $this->relations[] = 'images';

        return $this;
    }

    protected function loadCategories(&$adverts)
    {
        $keys = array_keys(array_column($adverts, 'category_id', 'category_id'));

        $categories = (new billboardCategoryModel())->getById($keys);

        foreach ($adverts as &$advert) {

            $categoryId = $advert['category_id'];

            $advert['category'] = ! empty($categories[$categoryId]) ? $categories[$categoryId] : [];
        }
    }

    protected function loadPartners(&$adverts)
    {
        $keys = array_keys(array_column($adverts, 'partner_id', 'partner_id'));

        foreach ($adverts as &$advert) {

            $partnerId = $advert['partner_id'];

            $advert['partner'] = new waContact($partnerId);
        }
    }

    protected function loadCities(&$adverts)
    {
        $keys = array_keys(array_column($adverts, 'city_id', 'city_id'));

        $cities = (new billboardCityModel())->getById($keys);

        foreach ($adverts as &$advert) {

            $cityId = $advert['city_id'];

            $advert['city'] = ! empty($cities[$cityId]) ? $cities[$cityId] : [];
        }
    }

    protected function loadImages(&$adverts)
    {
        $keys = array_keys($adverts);

        $images = (new billboardAdvertImagesModel())->getByAdverts($keys);

        foreach ($adverts as &$advert) {

            $advert['images'] = [];

            if (! empty($images[$advert['id']])) {

                $advert['images'] = $images[$advert['id']];
            }
        }
    }

    public function newModel()
    {
        return new billboardAdvertModel();
    }

    private function getEnv()
    {
        return wa(billboardHelper::APP_ID)->getConfig()->getEnvironment();
    }

    public function items()
    {
        $adverts = $this->builder()->get();

        if (billboardValidation::notBlank($this->relations)) {

            foreach ($this->relations as $relation) {

                $method = 'load' . ucfirst($relation);

                $this->{$method}($adverts);
            }
        }

        return $adverts;
    }
}
