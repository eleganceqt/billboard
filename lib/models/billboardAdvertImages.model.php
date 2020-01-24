<?php

class billboardAdvertImagesModel extends billboardModel
{
    const IMAGES_LIMIT = 5;

    protected $table = 'billboard_advert_images';

    public function add(waRequestFile $file, $advertId)
    {
        if ($file->uploaded()) {

            if (! ($image = $file->waImage())) {
                throw new waException(_w('Incorrect image'));
            }

            $filename = $this->sanitizeFilename($file, $advertId);

            if (! $this->saveFile($file, $filename, $advertId)) {

                $errors[] = sprintf(_w('Failed to upload file %s.'), $file->name);

                return false;
            }

            $attributes = [
                'advert_id'       => $advertId,
                'filename'        => $filename,
                'ext'             => $file->extension,
                'upload_datetime' => date('Y-m-d H:i:s'),
                'sort'            => $this->getNextSort($advertId),
            ];

            return $this->insert($attributes);

//            return true;

        } else {

            $errors[] = sprintf(_w('Failed to upload file %s.'), $file->name) . ' (' . $file->error . ')';

            return false;
        }

    }

    protected function sanitizeFilename(waRequestFile $file, $advertId)
    {
        $file->transliterateFilename();

        $name = $file->name;

        $path = billboardImage::protectedPath($advertId);

        if (! preg_match('//u', $name)) {
            $tmp_name = @iconv('windows-1251', 'utf-8//ignore', $name);
            if ($tmp_name) {
                $name = $tmp_name;
            }
        }
        if (file_exists($path . DIRECTORY_SEPARATOR . $name)) {
            $i    = strrpos($name, '.');
            $ext  = substr($name, $i + 1);
            $name = substr($name, 0, $i);
            $i    = 1;

            while (file_exists($path . DIRECTORY_SEPARATOR . $name . '-' . $i . '.' . $ext)) {
                $i++;
            }

            $name = $name . '-' . $i . '.' . $ext;
        }

        return $name;
    }

    public function saveFile(waRequestFile $file, $name, $advertId)
    {
        $path = billboardImage::protectedPath($advertId);

        return $file->moveTo($path, $name);
    }

    protected function getNextSort($advertId)
    {
        return (int) $this->select('IFNULL(MAX(sort) + 1, 0)')->where('advert_id = i:advert_id', ['advert_id' => $advertId])->fetchField();
    }

    public function getPreviewImages($advertId)
    {
        $images = $this->select('*')
                       ->where('advert_id = i:advert_id', ['advert_id' => $advertId])
                       ->order('sort ASC')
                       ->fetchAll('id');

        foreach ($images as &$image) {
            $image['url'] = billboardImage::getUrl($image, '970x0');
        }

        return $images;
    }

    public function delete($imageId)
    {
        $image = $this->getById($imageId);

        if ($image) {

            $imagePath = billboardImage::getImagePath($image);

            $thumbsPath = billboardImage::getThumbsPath($image);

            foreach (billboardImage::getSizes() as $size) {

                waFiles::delete($thumbsPath . $size . '_' . $image['filename']);

                waFiles::delete($imagePath);
            }

            $this->deleteById($imageId);

            $this->resetMainImage($image['advert_id']);
        }
    }

    public function resetMainImage($advertId)
    {
        $image = $this->select('*')
                      ->where('advert_id = i:advert_id', ['advert_id' => $advertId])
                      ->order('sort asc')
                      ->limit(1)
                      ->fetchAssoc();

        $imageId = billboardValidation::notBlank($image) ? $image['id'] : null;

        return (new billboardAdvertModel())->updateById($advertId, ['image_id' => $imageId]);
    }

    public function updateOrder($advertId, $sort)
    {
        foreach ($sort as $index => $imageId) {
            $this->updateByField(['id' => $imageId, 'advert_id' => $advertId], ['sort' => $index]);
        }

        $this->resetMainImage($advertId);
    }

    public function getByAdvert($advertId, $size)
    {
        $images = $this->select('*')
                       ->where('advert_id = i:advertId', ['advertId' => $advertId])
                       ->order('sort')
                       ->fetchAll('id');

        foreach ($images as &$image) {
            $image['url'] = billboardImage::getUrl($image, $size);
        }

        return $images;
    }

    public function getByAdverts($keys, $size = '970x0')
    {
        if (billboardValidation::blank($keys)) {
            return [];
        }

        $advertsImages = $this->select('*')
                              ->where('advert_id IN (:keys)', ['keys' => $keys])
                              ->fetchAll('advert_id', 2);


        foreach ($advertsImages as $advertId => &$images) {
            foreach ($images as &$image) {

                $image['advert_id'] = $advertId;

                $image['url'] = billboardImage::getUrl($image, $size, true);
            }
        }

//        foreach ($advertImages as &$advert) {
//            foreach ($advert as &$image) {
//                $image['url'] = billboardImage::getUrl($image, $size);
//            }
//        }

        return $advertsImages;
    }

    public function getMainImages($keys, $size)
    {
        if (billboardValidation::blank($keys)) {
            return [];
        }

        $sqlString = "SELECT `bai`.*
                      FROM billboard_advert_images AS `bai`
                      INNER JOIN billboard_advert AS `ba` ON `ba`.`id` = `bai`.`advert_id` AND `ba`.`image_id` = `bai`.`id`
                      WHERE `ba`.`id` IN (:keys)";

        $sqlParams = [
            'keys' => $keys
        ];

        $images = $this->query($sqlString, $sqlParams)->fetchAll('advert_id');

        foreach ($images as &$image) {
            $image['url'] = billboardImage::getUrl($image, $size);
        }

        return $images;
    }

    public function deleteByAdvertId($advertId)
    {
        // delete thumbs images
        waFiles::delete(billboardImage::publicPath($advertId));

        // delete original image
        waFiles::delete(billboardImage::protectedPath($advertId));

        // delete db record
        $this->deleteByField('advert_id', $advertId);
    }
}
