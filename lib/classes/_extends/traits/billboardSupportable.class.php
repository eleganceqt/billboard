<?php

trait billboardSupportable
{
    public function without(array $array, array $keys)
    {
        $adapted = $array;

        foreach ($keys as $key) {
            unset($adapted[$key]);
        }

        return $adapted;
    }

    public function startsWith($needle, $haystack)
    {
        if ($needle !== '' && substr($haystack, 0, strlen($needle)) === (string) $needle) {
            return true;
        }

        return false;
    }
}
