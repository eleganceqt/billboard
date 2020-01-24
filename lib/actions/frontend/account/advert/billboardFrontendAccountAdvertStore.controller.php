<?php

class billboardFrontendAccountAdvertStoreController extends billboardJsonController
{
    /**
     * @var array
     */
    protected $models;

    /**
     * @inheritDoc
     */
    public function execute()
    {
        if (! $this->failsValidation()) {

            $advertId = $this->storeAdvert();

            $this->uploadImages($advertId);

            $this->response['redirect_url'] = wa(billboardHelper::APP_ID)->getRouteUrl('/frontend/advert', ['advert_id' => $advertId]);
        }
    }

    /**
     * @return int
     */
    protected function storeAdvert()
    {
        $attributes = $this->request;

        $attributes['partner_id']      = wa(billboardHelper::APP_ID)->getUser()->getId();
        $attributes['create_datetime'] = date('Y-m-d H:i:s');
        $attributes['status']          = billboardAdvertModel::STATUS_ON;

        return $this->model('advert')->insert($attributes);
    }

    protected function uploadImages($advertId)
    {
        $validImages = 0;

        foreach ($this->request['images'] as $index => $image) {

            $imageId = $this->model('advertImages')->add($image, $advertId);

            if ($imageId) {

                $validImages++;

                $image = $this->model('advertImages')->getById($imageId);

                // set first image as main
                if ($validImages === 1) {
                    $this->model('advert')->setMainImage($advertId, $imageId);
                }

                billboardImage::generateThumbs($image);

                // limit only 5 images
                if ($validImages > 4) {
                    break;
                }
            }
        }
    }

    /**
     * @inheritDoc
     */
    protected function requestInputs()
    {
        $this->request = [
            'title'       => waRequest::request('title', '', waRequest::TYPE_STRING_TRIM),
            'category_id' => waRequest::request('category_id', null, waRequest::TYPE_INT),
            'city_id'     => waRequest::request('city_id', null, waRequest::TYPE_INT),
            'price'       => waRequest::request('price', 0),
            'description' => waRequest::request('description', '', waRequest::TYPE_STRING_TRIM),
            'images'      => waRequest::file('images'),
            'terms'       => waRequest::request('terms', null, waRequest::TYPE_STRING_TRIM)
        ];
    }

    /**
     * @inheritDoc
     */
    protected function runValidation()
    {
        if (billboardValidation::emptyString($this->request['title'])) {
            $this->errors[] = 'Поле «Заголовок» обязательно для заполнения.';
        }

        if (billboardValidation::notPositiveInt($this->request['category_id'])) {
            $this->errors[] = 'Поле «Категория» обязательно для заполнения.';
        }

        if (billboardValidation::notPositiveInt($this->request['city_id'])) {
            $this->errors[] = 'Поле «Город» обязательно для заполнения.';
        }

        if (billboardValidation::emptyString($this->request['price'])) {
            $this->errors[] = 'Поле «Цена» обязательно для заполнения.';
        } else {
            if (billboardValidation::notPositiveInt($this->request['price'])) {
                $this->errors[] = 'Значение поля «Цена» должна быть больше 0.';
            }
        }

        if (! wa()->getCaptcha()->isValid()) {
            $this->errors[] = 'Капча введена неверно.';
        }

        if (billboardValidation::notTrueVal($this->request['terms'])) {
            $this->errors[] = 'Вы не подтвердили согласие с условиями предоставления услуг.';
        }
    }

    /**
     * @param string $model
     *
     * @return billboardModel|billboardAdvertModel|billboardAdvertImagesModel
     */
    private function model($model)
    {
        if (isset($this->models[$model])) {
            return $this->models[$model];
        }

        $class = $this->buildModelQualifiedName($model);

        $this->models[$model] = new $class();

        return $this->models[$model];
    }

    /**
     * @param string $model
     *
     * @return string
     */
    private function buildModelQualifiedName($model)
    {
        return 'billboard' . ucfirst($model) . 'Model';
    }
}
