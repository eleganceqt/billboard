<?php

class billboardCitiesCreateController extends billboardJsonController
{
    /**
     * @inheritDoc
     */
    public function execute()
    {
        $city = billboardCityModel::mock();

        $this->response['content'] = (new billboardCitiesModalAction())->renderWith(compact('city'));
    }
}
