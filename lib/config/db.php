<?php

return [
    'billboard_advert'            => [
        'id'              => ['int', 11, 'null' => 0, 'autoincrement' => 1],
        'partner_id'      => ['int', 11, 'null' => 0],
        'category_id'     => ['int', 11, 'null' => 0],
        'city_id'         => ['int', 11, 'null' => 0],
        'title'           => ['varchar', 255, 'null' => 0],
        'description'     => ['text'],
        'price'           => ['decimal', "15,4", 'null' => 0, 'default' => '0.0000'],
        'image_id'        => ['int', 11],
        'create_datetime' => ['datetime', 'null' => 0],
        'edit_datetime'   => ['datetime'],
        'views'           => ['int', 11, 'null' => 0, 'default' => '0'],
        'status'          => ['varchar', 255, 'null' => 0],
        ':keys'           => [
            'PRIMARY' => 'id',
        ],
    ],
    'billboard_advert_images'     => [
        'id'              => ['int', 11, 'null' => 0, 'autoincrement' => 1],
        'advert_id'       => ['int', 11, 'null' => 0],
        'filename'        => ['varchar', 255, 'null' => 0],
        'ext'             => ['varchar', 255, 'null' => 0],
        'upload_datetime' => ['datetime', 'null' => 0],
        'sort'            => ['int', 11, 'null' => 0],
        ':keys'           => [
            'PRIMARY' => 'id',
        ],
    ],
    'billboard_category'          => [
        'id'               => ['int', 11, 'null' => 0, 'autoincrement' => 1],
        'left_key'         => ['int', 11],
        'right_key'        => ['int', 11],
        'depth'            => ['int', 11, 'null' => 0, 'default' => '0'],
        'parent_id'        => ['int', 11, 'null' => 0, 'default' => '0'],
        'name'             => ['varchar', 255, 'null' => 0],
        'description'      => ['text', 'null' => 0],
        'slug'             => ['varchar', 255, 'null' => 0],
        'title'            => ['varchar', 255, 'null' => 0],
        'meta_keywords'    => ['text', 'null' => 0],
        'meta_description' => ['text', 'null' => 0],
        'status'           => ['varchar', 255, 'null' => 0],
        ':keys'            => [
            'PRIMARY' => 'id',
        ],
    ],
    'billboard_city'              => [
        'id'           => ['int', 11, 'null' => 0, 'autoincrement' => 1],
        'name'         => ['varchar', 255, 'null' => 0],
        'country_iso3' => ['varchar', 3, 'null' => 0],
        'ranking'      => ['int', 11, 'null' => 0, 'default' => '0'],
        ':keys'        => [
            'PRIMARY' => 'id',
        ],
    ],
    'billboard_partner_favorites' => [
        'id'         => ['int', 11, 'null' => 0, 'autoincrement' => 1],
        'partner_id' => ['int', 11, 'null' => 0],
        'advert_id'  => ['int', 11, 'null' => 0],
        ':keys'      => [
            'PRIMARY' => 'id',
        ],
    ],
];
