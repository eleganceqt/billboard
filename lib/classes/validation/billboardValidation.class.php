<?php

use Respect\Validation\Validator as v;

class billboardValidation
{
    public static function blank($input)
    {
        return v::not(v::notBlank())->validate($input);
    }

    public static function notBlank($input)
    {
        return v::notBlank()->validate($input);
    }

    public static function positiveInt($input)
    {
        return v::intVal()->positive()->validate($input);
    }

    public static function notPositiveInt($input)
    {
        return v::not(v::intVal()->positive())->validate($input);
    }

    public static function trueVal($input)
    {
        return v::trueVal()->validate($input);
    }

    public static function notTrueVal($input)
    {
        return v::not(v::trueVal())->validate($input);
    }

    public static function emptyString($input)
    {
        if (v::not(v::stringType())->validate($input)) {
            return false;
        }

        return trim($input) === '';
    }

    public static function notEmptyString($input)
    {
        return ! self::emptyString($input);
    }
}
