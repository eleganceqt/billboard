<?php

return [
    ''                      => 'backend',

    /*
    |-------------------------------------------------------------------------------------------------------------------
    | Adverts routes
    |-------------------------------------------------------------------------------------------------------------------
    */
    'adverts/'              => 'adverts',
    'adverts/show/'         => 'adverts/show',
    'adverts/hide/'         => 'adverts/hide',
    'adverts/uploadImages/' => 'adverts/uploadImages',
    'adverts/deleteImage/'  => 'adverts/deleteImage',
    'adverts/sortImages/'   => 'adverts/sortImages',
    'adverts/edit/'         => 'adverts/edit',
    'adverts/update/'       => 'adverts/update',
    'adverts/delete/'       => 'adverts/delete',
    'adverts/refine/'       => 'adverts/refine',

    /*
    |-------------------------------------------------------------------------------------------------------------------
    | Partners routes
    |-------------------------------------------------------------------------------------------------------------------
    */
    'partners/'             => 'partners',
    'partners/edit/'        => 'partners/edit',
    'partners/refine/'      => 'partners/refine',
    'partners/hideAll/'     => 'partners/hideAll',
    'partners/showAll/'     => 'partners/showAll',
    'partners/deleteAll/'   => 'partners/deleteAll',

    /*
    |-------------------------------------------------------------------------------------------------------------------
    | Cities routes
    |-------------------------------------------------------------------------------------------------------------------
    */
    'cities/'               => 'cities',
    'cities/create/'        => 'cities/create',
    'cities/store/'         => 'cities/store',
    'cities/edit/'          => 'cities/edit',
    'cities/update/'        => 'cities/update',
    'cities/delete/'        => 'cities/delete',
    'cities/refine/'        => 'cities/refine',

    /*
    |-------------------------------------------------------------------------------------------------------------------
    | Categories routes
    |-------------------------------------------------------------------------------------------------------------------
    */
    'categories/'           => 'categories/',
    'categories/create/'    => 'categories/create',
    'categories/store/'     => 'categories/store',
    'categories/edit/'      => 'categories/edit',
    'categories/update/'    => 'categories/update',
    'categories/delete/'    => 'categories/delete',
    'categories/move/'      => 'categories/move',
    'categories/hideAll/'   => 'categories/hideAll',
    'categories/showAll/'   => 'categories/showAll',
    'categories/deleteAll/' => 'categories/deleteAll',

    /*
    |
    |-------------------------------------------------------------------------------------------------------------------
    | Plugins routes
    |-------------------------------------------------------------------------------------------------------------------
    |
    */
    'pages/'                => 'pages/',
    'pages/<id>/edit/'      => 'pages/edit',

    /*
    |
    |-------------------------------------------------------------------------------------------------------------------
    | Plugins routes
    |-------------------------------------------------------------------------------------------------------------------
    |
    */
    'plugins/'              => 'plugins/',
    'plugins/<id>/'         => [
        'module' => 'plugins',
        'action' => 'settings',
    ]
];
