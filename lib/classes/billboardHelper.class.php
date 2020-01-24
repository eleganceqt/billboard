<?php

class billboardHelper
{
    const APP_ID = 'billboard';

    public static function getAppPath($path)
    {
        return wa()->getAppPath($path, self::APP_ID);
    }

    public static function getConfigOption($key)
    {
        return wa(self::APP_ID)->getConfig()->getOption($key);
    }

    public static function transliterate($slug)
    {
        $slug = preg_replace('/\s+/', '-', $slug);

        if ($slug) {
            foreach (waLocale::getAll() as $lang) {
                $slug = waLocale::transliterate($slug, $lang);
            }
        }

        $slug = preg_replace('/[^a-zA-Z0-9_-]+/', '', $slug);

        if (! $slug) {
            $slug = date('Ymd');
        }

        return strtolower($slug);
    }
}
