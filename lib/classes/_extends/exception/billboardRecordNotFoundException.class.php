<?php

class billboardRecordNotFoundException extends waException
{
    public function __construct($message = null, $code = 404, $previous = null)
    {
        if ($message === null) {
            $message = _ws('Record not found');
        }

        parent::__construct($message, $code, $previous);
    }
}
