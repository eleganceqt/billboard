<?php

class billboardAdvertsUpdateController extends billboardJsonController
{
    use billboardUseModels;
    use billboardSupportable;

    /**
     * @inheritDoc
     */
    public function execute()
    {
        if (! $this->failsValidation()) {
            $this->updateAdvert($this->request['id']);
        }
    }

    protected function updateAdvert($advertId)
    {
        $attributes = $this->without($this->request, ['id']);

        $attributes['edit_datetime'] = date('Y-m-d H:i:s');

        return $this->model('advert')->updateById($advertId, $attributes);
    }

    /**
     * @inheritDoc
     */
    protected function requestInputs()
    {
        $this->request = [
            'id'          => waRequest::request('id', null, waRequest::TYPE_INT),
            'status'      => waRequest::request('status', null, waRequest::TYPE_STRING_TRIM),
            'title'       => waRequest::request('title', '', waRequest::TYPE_STRING_TRIM),
            'category_id' => waRequest::request('category_id', null, waRequest::TYPE_INT),
            'city_id'     => waRequest::request('city_id', null, waRequest::TYPE_INT),
            'price'       => waRequest::request('price', 0),
            'description' => waRequest::request('description', '', waRequest::TYPE_STRING_TRIM),
        ];
    }

    protected function runValidation()
    {
        if (billboardValidation::notPositiveInt($this->request['id'])) {
            $this->errors[] = 'Недействительный идентификатор объявления.';
        }

        if (billboardValidation::emptyString($this->request['status'])) {
            $this->errors[] = 'Поле «Статус» обязательно для заполнения.';
        } else {
            if (! billboardAdvertModel::isValidStatus($this->request['status'])) {
                $this->errors[] = 'Неизвестное значение для поле «Статус».';
            }
        }

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
    }
}
