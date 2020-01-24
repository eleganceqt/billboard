<?php

trait billboardCollectionable
{
    /**
     * @var billboardCollection
     */
    protected $collection;

    /**
     * @param billboardCollection $collection
     *
     * @return void
     */
    public function setCollection(billboardCollection $collection)
    {
        $this->collection = $collection;
    }

    /**
     * @return billboardCollection|billboardCityCollection|billboardAdvertCollection
     */
    public function collection()
    {
        return $this->collection;
    }
}
