<?php

class billboardModel extends waModel
{
    protected $as;

    protected $perPage;

    public function table()
    {
        return $this->table;
    }

    public function alias()
    {
        return $this->as;
    }

    public function notFound()
    {
        throw new billboardRecordNotFoundException();
    }

    public function escapeLike($value, $char = '\\')
    {
        return str_replace(
            [$char, '%', '_'],
            [$char . $char, $char . '%', $char . '_'],
            $value
        );
    }

    public function perPage()
    {
        return $this->perPage;
    }
}
