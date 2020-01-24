<?php

class billboardExporterPluginBackendDownloadController extends waController
{
    public function execute()
    {
        $name = basename(waRequest::get('file'));

        $file = wa()->getTempPath('csv/') . $name;

        waFiles::readFile($file, $name);
    }
}
