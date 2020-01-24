<?php

class billboardExporterPluginSettingsAction extends billboardBackendViewAction
{
    public function execute()
    {
        $items = (new billboardAdvertCollection())//->skip($this->data['offset'])
                                                  //                            ->take(10)
        ->withCategories()
        ->withPartners()
        ->withCities()
        ->withImages()
        ->latest()
        ->items();

//        billboardVarDumper::dump(
////            (new billboardAdvertImagesModel())->getByAdverts(['1','2', 25, 26, 27])
//            $items
//        );

//        $headers = ['Идентификатор', 'Кастомный Идентификатор', 'Партнёр', 'Категория', 'Город', 'Заголовок', 'Описание', 'Цена', 'Дата размещения', 'Статус'];
//        $headers = array_merge($headers, array_fill(0, billboardAdvertImagesModel::IMAGES_LIMIT, 'Изображения'));
////        foreach ($items as $item) {
//        wa_dumpc(
//            $headers
//        );
//        }
//        wa_dumpc(
//
//            billboardExporterPluginCsvWriter::createFromFileObject(new SplTempFileObject())
////            new billboardExporterPluginCsvWriter()
//        );
        $this->renderSidebar();
    }

    public function renderSidebar()
    {
        $this->view()->assign('sidebar', (new billboardPluginsSidebarAction())->render());
    }
}
