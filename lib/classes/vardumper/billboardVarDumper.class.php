<?php

use Symfony\Component\VarDumper\VarDumper;

class billboardVarDumper
{
    public static function dump(...$vars)
    {
        foreach ($vars as $var) {
            VarDumper::dump($var);
        }
    }
}
