<?php

class billboardFrontendAccountAdvertUpdateController extends billboardFrontendAccountAdvertResourceController
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

            $this->updateAdvert($this->getAdvertId());
        }
    }

    protected function updateAdvert($advertId)
    {
        $attributes = $this->request;

        $attributes['edit_datetime'] = date('Y-m-d H:i:s');

        return $this->model('advert')->updateById($advertId, $attributes);
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

//        if (! wa()->getCaptcha()->isValid()) {
//            $this->errors[] = 'Капча введена неверно.';
//        }
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
