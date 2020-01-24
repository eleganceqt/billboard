<?php

class billboardImage
{
    /**
     * @var array
     */
    protected static $sizes = [
        '140x140',
        '170x200',
        '268x268',
        '970x0'
    ];

    public static function getSizes()
    {
        return self::$sizes;
    }

    public static function publicPath($advertId)
    {
        return wa(billboardHelper::APP_ID)->getDataPath('adverts/' . $advertId . '/images/', true);
    }

    public static function publicUrl($advertId, $absolute = false)
    {
        return wa(billboardHelper::APP_ID)->getDataUrl('adverts/' . $advertId . '/images/', true, null, $absolute);
    }

    public static function protectedPath($advertId)
    {
        return wa(billboardHelper::APP_ID)->getDataPath('adverts/' . $advertId . '/images/', false);
    }

    public static function protectedUrl($advertId)
    {
        return wa(billboardHelper::APP_ID)->getDataUrl('adverts/' . $advertId . '/images/', false);
    }

    public static function generateThumbs($image)
    {
        $sizes = self::getSizes();

        $imagePath = self::getImagePath($image);

        $thumbsPath = self::getThumbsPath($image);

        if (! file_exists($thumbsPath) && ! waFiles::create($thumbsPath)) {
            throw new waException("Insufficient write permissions for the $thumbsPath dir.");
        }

        foreach ($sizes as $size) {

            $thumbPath = $thumbsPath . $size . '_' . $image['filename'];

            if (! file_exists($thumbPath)) {
                if ($thumbImage = self::generateThumb($imagePath, $size)) {
                    $thumbImage->save($thumbPath, 90);
                }
            }
        }

        clearstatcache();
    }

    public static function generateThumb($imagePath, $size)
    {
        /** @var waImageImagick|waImageGd $image */
        $image = waImage::factory($imagePath);

        list($type, $width, $height) = array_values(self::parseSize($size));

//        wa_dumpc([$type, $width, $height]);

        switch ($type) {
            case 'max':
                $image->resize($width, $height);
                break;
            case 'width':
                $image->resize($width, $height);
                break;
            case 'height':
                $image->resize($width, $height);
                break;
            case 'crop':
            case 'rectangle':
                $image->resize($width, $height, waImage::INVERSE)->crop($width, $height);
                break;
            default:
                throw new waException("Unknown type");
                break;
        }

        return $image;
    }

    /**
     * @param string $size
     *
     * @return array
     */
    protected static function parseSize($size)
    {
        $type    = 'unknown';
        $ar_size = explode('x', $size);
        $width   = ! empty($ar_size[0]) ? $ar_size[0] : null;
        $height  = ! empty($ar_size[1]) ? $ar_size[1] : null;

        if (count($ar_size) == 1) {
            $type   = 'max';
            $height = $width;
        } else if ($width == $height) { // crop
            $type = 'crop';
        } else if ($width && $height) { // rectangle
            $type = 'rectangle';
        } else if (is_null($width)) {
            $type = 'height';
        } else if (is_null($height)) {
            $type = 'width';
        }

        return array(
            'type'   => $type,
            'width'  => $width,
            'height' => $height
        );
    }

    public static function getImagePath($image)
    {
        $path = self::protectedPath($image['advert_id']);

        return $path . $image['filename'];
    }

    public static function getOriginalPath($image)
    {
        return self::protectedPath($image['advert_id']);
    }

    public static function getThumbsPath($image)
    {
        return self::publicPath($image['advert_id']);
    }

    public static function getUrl_old($image, $size)
    {
        return self::getThumbsUrl($image) . $size . '_' . $image['filename'];
    }

    public static function getUrl($image, $size, $absolute = false)
    {
//        wa_dumpc($image);
        if (self::thumbMissing($image, $size)) {

            $imagePath = self::getImagePath($image);

            $thumbsPath = self::getThumbsPath($image);

            if (! file_exists($thumbsPath) && ! waFiles::create($thumbsPath)) {
                throw new waException("Insufficient write permissions for the $thumbsPath dir.");
            }

            $thumbPath = $thumbsPath . $size . '_' . $image['filename'];

            if (! file_exists($thumbPath)) {
                if ($thumbImage = self::generateThumb($imagePath, $size)) {
                    $thumbImage->save($thumbPath, 90);
                }
            }
        }

        return self::getThumbsUrl($image, $absolute) . $size . '_' . $image['filename'];
    }

    public static function thumbMissing($image, $size)
    {
        return ! self::thumbExists($image, $size);
    }

    public static function thumbExists($image, $size)
    {
        $thumbsPath = self::getThumbsPath($image);

        $thumbPath = $thumbsPath . $size . '_' . $image['filename'];

        return file_exists($thumbPath);
    }

    public static function getThumbsUrl($image, $absolute = false)
    {
        return self::publicUrl($image['advert_id'], $absolute);
    }


//    public static function getPreviewUrl($image)
//    {
//        return self::protectedUrl($image['advert_id']) . $image['filename'];
//    }
}
