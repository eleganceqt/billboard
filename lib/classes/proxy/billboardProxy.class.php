<?php

abstract class billboardProxy
{
    protected static $resolved = [];

    /**
     *
     *
     * @return string
     *
     * @throws waException
     */
    public static function intermediar()
    {
        throw new waException('Proxy does not implement intermediar method.');
    }

    protected static function resolveProxyInstance($instance)
    {
        if (isset(static::$resolved[$instance])) {
            return static::$resolved[$instance];
        }

        return static::$resolved[$instance] = new $instance();
    }

    /**
     * @param string $method
     * @param array $args
     *
     * @return mixed
     * @throws waException
     */
    public static function __callStatic($method, $args)
    {
        $instance = static::resolveProxyInstance(static::intermediar());

        if (! $instance) {
            throw new waException('A proxy intermediar has not been set.');
        }

        return $instance->$method(...$args);
    }
}
