<?php

class billboardAdvertsUploadImagesController extends billboardJsonController
{
    use billboardUseModels;

    /**
     * @inheritDoc
     */
    public function execute()
    {
        if (! $this->failsValidation()) {

            $this->uploadImages($this->request['id']);
        }
    }

    protected function uploadImages($advertId)
    {
        $validImages = 0;

        $uploadLimit = billboardAdvertImagesModel::IMAGES_LIMIT - $this->toUploadCount();

        if ($uploadLimit > 0) {

            foreach (waRequest::file('images') as $index => $image) {

                $imageId = $this->model('advertImages')->add($image, $advertId);

                if ($imageId) {

                    $validImages++;

                    $image = $this->model('advertImages')->getById($imageId);

                    billboardImage::generateThumbs($image);

                    $image['url'] = $image['url'] = billboardImage::getUrl($image, '480x320');

                    $this->response['files'][] = $image;

                    // limit images count
                    if ($validImages >= $uploadLimit) {
                        break;
                    }
                }
            }

            $this->model('advertImages')->resetMainImage($advertId);
        }
    }

    protected function toUploadCount()
    {
        return (int) $this->model('advertImages')->countByField('advert_id', $this->request['id']);
    }

    /**
     * @inheritDoc
     */
    protected function requestInputs()
    {
        $this->request = [
            'id' => waRequest::request('id', null, waRequest::TYPE_INT),
        ];
    }

    /**
     * @inheritDoc
     */
    protected function runValidation()
    {
        if (billboardValidation::notPositiveInt($this->request['id'])) {
            $this->errors[] = 'Недействительный идентификатор объявления.';
        }
    }
}
