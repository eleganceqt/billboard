<?php

class billboardFrontendAccountAdvertUploadImagesController extends billboardFrontendAccountAdvertResourceController
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
        $this->uploadImages($this->getAdvertId());
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

                    $image['deleteUrl'] = wa()->getRouteUrl('/frontend/accountAdvertDeleteImage', ['advert_id' => $advertId, 'image_id' => $imageId]);

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
        return (int) $this->model('advertImages')->countByField('advert_id', $this->getAdvertId());
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
