<?php

class billboardCityCollection extends billboardCollection
{
    public function search($query)
    {
        if (billboardValidation::notBlank($query)) {
            $this->builder()->whereLike('name', $this->model()->escapeLike($query) . '%');
        }

        return $this;
    }

    public function sort($column, $direction)
    {
        $column = billboardValidation::notBlank($column) ? $column : 'ranking';

        $direction = billboardValidation::notBlank($direction) ? $direction : 'desc';

        if ($column === 'active_adverts') {

            return $this->sortByActiveAdverts($direction);

        } else {

            return parent::sort($column, $direction);
        }
    }

    public function withAdvertsCount()
    {
        $this->relations[] = 'advertsCount';

        return $this;
    }

    public function loadAdvertsCount(&$cities)
    {
        $counts = (new billboardAdvertModel())->countByCities(array_keys($cities));

        foreach ($cities as &$city) {

            $city['active_count'] = 0;
            $city['total_count']  = 0;

            if (! empty($counts[$city['id']])) {
                $city['active_count'] = $counts[$city['id']]['active_count'];
                $city['total_count']  = $counts[$city['id']]['total_count'];
            }
        }
    }

    public function sortByActiveAdverts($direction)
    {
        $this->builder()->select(['billboard_city.*', "SUM(IF(billboard_advert.status = 'on', 1, 0)) AS active_count"]);

        $this->builder()->leftJoin('billboard_advert', 'billboard_city.id', '=', 'billboard_advert.city_id');

        $this->builder()->groupBy(' billboard_city.id');

        $this->sort('active_count', $direction);

        $this->sort('name', 'asc');

        return $this;
    }

    public function items()
    {
//        wa_dumpc(
//            $this->builder()->getQueryString()
//        );
        $cities = $this->builder()->get();

        if (billboardValidation::notBlank($this->relations)) {

            foreach ($this->relations as $relation) {

                $method = 'load' . ucfirst($relation);

                $this->{$method}($cities);
            }
        }

        return $cities;
    }

    public function limit()
    {
        $limit = billboardValidation::notBlank($this->builder()->limit) ? $this->builder()->limit : billboardHelper::getConfigOption('backend_cities_per_page');

        return billboardValidation::notBlank($limit) ? (int) $limit : $this->model()->perPage();
    }

    public function newModel()
    {
        return new billboardCityModel();
    }
}
