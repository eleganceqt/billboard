<?php

class billboardCategoriesStoreController extends billboardJsonController
{
    use billboardModelable;
    use billboardSupportable;

    protected function preExecute()
    {
        $this->setModel(new billboardCategoryModel());

        parent::preExecute();
    }

    public function execute()
    {
        if (! $this->failsValidation()) {

            $this->storeRecord();

        }
    }

    protected function storeRecord()
    {
        $attributes = $this->without($this->request, ['parent_id']);

        $attributes['id'] = $this->model()->add($attributes, $this->request['parent_id']);

        $attributes['parent_id'] = $this->request['parent_id'];

        $this->response['category'] = $attributes;
    }

    protected function requestInputs()
    {
        $this->request = [
            'parent_id'        => waRequest::request('parent_id', null, waRequest::TYPE_INT),
            'name'             => waRequest::request('name', '', waRequest::TYPE_STRING_TRIM),
            'description'      => waRequest::request('description', '', waRequest::TYPE_STRING_TRIM),
            'slug'             => billboardHelper::transliterate(waRequest::request('slug', '', waRequest::TYPE_STRING_TRIM)),
            'title'            => waRequest::request('title', '', waRequest::TYPE_STRING_TRIM),
            'meta_keywords'    => waRequest::request('meta_keywords', '', waRequest::TYPE_STRING_TRIM),
            'meta_description' => waRequest::request('meta_description', '', waRequest::TYPE_STRING_TRIM),
            'status'           => waRequest::request('status', '', waRequest::TYPE_STRING_TRIM),
        ];
    }

    protected function runValidation()
    {
        if (billboardValidation::blank($this->request['name'])) {
            $this->errors[] = 'Поле название обязательно для заполнения.';
        }

        if (billboardValidation::blank($this->request['slug'])) {
            $this->errors[] = 'Поле урл обязательно для заполнения.';
        }

        if (billboardValidation::notBlank($this->request['slug']) && $this->model()->isSlugTaken($this->request['slug'])) {
            $this->errors[] = 'Категория с таким урл уже существует.';
        }

        if (billboardValidation::blank($this->request['status'])) {
            $this->errors[] = 'Поле статус обязательно для заполнения.';
        }

        if (billboardValidation::notBlank($this->request['status']) && ! $this->model()->isValidStatus($this->request['status'])) {
            $this->errors[] = 'Неизвестный статус категории.';
        }
    }
}
