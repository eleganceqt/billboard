<?php

return [
    '' => 'frontend',

    'login/'          => 'login',
    'signup/'         => 'signup',
    'forgotpassword/' => 'forgotpassword',

    'advert/<advert_id:\d+>/' => 'frontend/advert',

    'category/<category_url>/' => 'frontend/category',

    'search/' => 'frontend/search',

    'sidebar/' => 'frontend/sidebar',

    'account/adverts/' => [
        'module' => 'frontend',
        'action' => 'accountAdverts',
        'secure' => true,
    ],

    'account/favorites/' => [
        'module' => 'frontend',
        'action' => 'accountFavorites',
        'secure' => true,
    ],

    'account/favorite/add/<advert_id:\d+>/' => [
        'module' => 'frontend',
        'action' => 'accountFavoriteAdd',
        'secure' => true,
    ],

    'account/favorite/remove/<advert_id:\d+>/' => [
        'module' => 'frontend',
        'action' => 'accountFavoriteRemove',
        'secure' => true,
    ],

    'account/advert/create/' => [
        'module' => 'frontend',
        'action' => 'accountAdvertCreate',
        'secure' => true,
    ],

    'account/advert/store/' => [
        'module' => 'frontend',
        'action' => 'accountAdvertStore',
        'secure' => true,
    ],

    'account/advert/edit/<advert_id:\d+>/' => [
        'module' => 'frontend',
        'action' => 'accountAdvertEdit',
        'secure' => true,
    ],

    'account/advert/update/<advert_id:\d+>/' => [
        'module' => 'frontend',
        'action' => 'accountAdvertUpdate',
        'secure' => true,
    ],

    'account/advert/hide/<advert_id:\d+>/' => [
        'module' => 'frontend',
        'action' => 'accountAdvertHide',
        'secure' => true,
    ],

    'account/advert/show/<advert_id:\d+>/' => [
        'module' => 'frontend',
        'action' => 'accountAdvertShow',
        'secure' => true,
    ],

    'account/advert/delete/<advert_id:\d+>/' => [
        'module' => 'frontend',
        'action' => 'accountAdvertDelete',
        'secure' => true,
    ],

    'account/advert/<advert_id:\d+>/upload/images/' => [
        'module' => 'frontend',
        'action' => 'accountAdvertUploadImages',
        'secure' => true,
    ],

    'account/advert/<advert_id:\d+>/sort/images/' => [
        'module' => 'frontend',
        'action' => 'accountAdvertSortImages',
        'secure' => true,
    ],

    'account/advert/<advert_id:\d+>/delete/image/<image_id:\d+>/' => [
        'module' => 'frontend',
        'action' => 'accountAdvertDeleteImage',
        'secure' => true,
    ],
];
