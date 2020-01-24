<?php

class billboardExporterPluginBackendRunController extends waLongActionController
{
    use billboardCollectionable;

    /**
     * @var string
     */
    protected $type;

    /**
     * @var array
     */
    protected $values;

    /**
     * @var string
     */
    protected $from;

    /**
     * @var string
     */
    protected $to;

    /**
     * @var billboardExporterPluginCsvWriter
     */
    protected $writer;

    /**
     * @inheritDoc
     */
    protected function preExecute()
    {
        $this->getResponse()->addHeader('Content-type', 'application/json');
        $this->getResponse()->sendHeaders();

        $this->requestParams();
    }

    public function execute()
    {
        try {
            parent::execute();
        } catch (waException $ex) {
            if ($ex->getCode() == '302') {
                echo $this->json(array('warning' => $ex->getMessage()));
            } else {
                echo $this->json(array('error' => $ex->getMessage()));
            }
        }
    }

    protected function init()
    {
        $this->buildCollection();

        $this->buildWriter();

        $this->data['offset']     = 0;
        $this->data['total']      = $this->collection()->count();
        $this->data['timestamp']  = time();
        $this->data['memory']     = memory_get_peak_usage();
        $this->data['memory_avg'] = memory_get_usage();

        $this->createExportFile();

//        $this->createFile();
//        $filepath = wa()->getTempPath('csv/') . date('Y-m-d') . '.csv';
//        $writer   = billboardExporterPluginCsvWriter::createFromPath($filepath, 'a+');
////        $writer   = billboardExporterPluginCsvWriter::createFromPath($filepath, 'a+');
//        $writer->setDelimiter(';');
////        $writer->setNewline("\r\n");
//        $writer->setEncodingFrom('UTF-8');
//        $writer->setOutputBOM(billboardExporterPluginCsvWriter::BOM_UTF8);
//
//        $writer->appendStreamFilter('convert.iconv.UTF-8/Windows-1251');
//
//        $headers = ['Идентификатор', 'Кастомный Идентификатор', 'Партнёр', 'Категория', 'Город', 'Заголовок', 'Описание', 'Цена', 'Дата размещения', 'Статус'];
//        $headers = array_merge($headers, array_fill(0, billboardAdvertImagesModel::IMAGES_LIMIT, 'Изображения'));
//
//        $writer->insertOne($headers);
    }

    protected function restore()
    {
        $this->buildCollection();

        $this->buildWriter();
    }

    protected function isDone()
    {
        return $this->data['offset'] >= $this->data['total'];
    }

    protected function step()
    {

//        $filepath = wa()->getTempPath('csv/') . date('Y-m-d') . '.csv';
//        $writer   = billboardExporterPluginCsvWriter::createFromPath($filepath, 'a+');
//        $writer->setDelimiter(';');
//        $writer->setEncodingFrom('UTF-8');
//        $writer->setOutputBOM(billboardExporterPluginCsvWriter::BOM_UTF8);
//
//        $writer->appendStreamFilter('convert.iconv.UTF-8/Windows-1251');

        $items = $this->collection()
                      ->skip($this->data['offset'])
                      ->take(3)
                      ->withCategories()
                      ->withPartners()
                      ->withCities()
                      ->withImages()
                      ->items();

        foreach ($items as $item) {

            $row = [
                $item['id'],
                'advert-' . $item['id'],
                ($item['partner']->exists() ? $item['partner']->getName() : ''),
                ifempty($item['category'], 'name', ''),
                ifempty($item['city'], 'name', ''),
                $item['title'],
                $item['description'],
                (int) $item['price'],
                $item['create_datetime'],
                $item['status'],
            ];

            $row = array_merge($row, array_column($item['images'], 'url'));

            $this->writer->insertOne($row);

            $this->data['offset'] += 1;
        }
    }

    protected function finish($filename)
    {
        $this->info();

        if (waRequest::post('cleanup')) {
            return true;
        }

        return false;
    }

    protected function info()
    {
        $interval = 0;
        if (! empty($this->data['timestamp'])) {
            $interval = time() - $this->data['timestamp'];
        }
        $response             = array(
            'time'       => sprintf('%d:%02d:%02d', floor($interval / 3600), floor($interval / 60) % 60, $interval % 60),
            'processId'  => $this->processId,
            'progress'   => 0.0,
            'ready'      => $this->isDone(),
            'offset'     => $this->data['offset'],
            'total'      => $this->data['total'],
            'memory'     => $this->data['memory'],
            'memory_avg' => $this->data['memory_avg']
        );
        $response['progress'] = empty($this->data['total']) ? 100 : ($this->data['offset'] / $this->data['total']) * 100;
        $response['progress'] = sprintf('%0.3f%%', $response['progress']);
//
        if ($this->getRequest()->post('cleanup')) {
            $response['file'] = date('Y-m-d') . '-' . $this->type . '.csv';
        }

        echo json_encode($response);
    }


    protected function requestParams()
    {
        $this->type = waRequest::request('type', null, waRequest::TYPE_STRING_TRIM);

        $this->values = waRequest::request('values', [], waRequest::TYPE_ARRAY);

        $this->from = waRequest::request('date_from', null, waRequest::TYPE_STRING_TRIM);

        $this->to = waRequest::request('date_to', null, waRequest::TYPE_STRING_TRIM);
    }

    protected function buildCollection()
    {
        $this->setCollection(new billboardAdvertCollection());

        if (in_array('all', $this->values)) {

            $this->collection()->latest();

        } else {

            if ($this->type === 'adverts') {
                $this->collection()->in($this->values);
            }

            if ($this->type === 'categories') {
                $this->collection()->inCategories($this->values);
            }

            if ($this->type === 'partners') {
                $this->collection()->byPartners($this->values);
            }

            if ($this->type === 'cities') {
                $this->collection()->inCities($this->values);
            }
        }

        $this->collection()
             ->from($this->from)
             ->to($this->to);

//        wa_dumpc(
//            $this->collection()->builder()->getQueryString()
//        );
    }

    protected function buildWriter()
    {
        $filepath = $this->buildFilepath();

        $this->writer = billboardExporterPluginCsvWriter::createFromPath($filepath, 'a+');

        $this->writer
            ->setDelimiter(';')
            ->setEncodingFrom('UTF-8')
            ->setOutputBOM(billboardExporterPluginCsvWriter::BOM_UTF8)
            ->appendStreamFilter('convert.iconv.UTF-8/Windows-1251');

//        $this->writer->setEncodingFrom('UTF-8');
//        $this->writer->setOutputBOM(billboardExporterPluginCsvWriter::BOM_UTF8);

//        $this->writer->appendStreamFilter('convert.iconv.UTF-8/Windows-1251');
    }

    protected function buildFilepath()
    {
        return wa()->getTempPath('csv/') . date('Y-m-d') . '-' . $this->type . '.csv';
    }

    protected function createExportFile()
    {
        waFiles::write($this->buildFilepath(), null);

        $headers = ['Идентификатор', 'Кастомный Идентификатор', 'Партнёр', 'Категория', 'Город', 'Заголовок', 'Описание', 'Цена', 'Дата размещения', 'Статус'];
        $headers = array_merge($headers, array_fill(0, billboardAdvertImagesModel::IMAGES_LIMIT, 'Изображения'));

        $this->writer->insertOne($headers);
    }
//
//    protected function ()
//    {
//
//    }
}
