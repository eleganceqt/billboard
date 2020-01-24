<?php

class billboardAdvertsDeleteImageController extends billboardJsonController
{
    use billboardUseModels;

    /**
     * @inheritDoc
     */
    public function execute()
    {
        if (! $this->failsValidation()) {
            $this->model('advertImages')->delete($this->request['imageId']);
        }
    }

    /**
     * @inheritDoc
     */
    protected function requestInputs()
    {
        $this->request = [
            'imageId' => waRequest::request('image_id', null, waRequest::TYPE_INT)
        ];
    }

    /**
     * @inheritDoc
     */
    protected function runValidation()
    {
        if (billboardValidation::notPositiveInt($this->request['imageId'])) {
            $this->errors[] = 'Недействительный идентификатор изображения.';
        }
    }
}
