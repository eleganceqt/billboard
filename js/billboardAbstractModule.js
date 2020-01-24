(function ($, window, document) {

    'use strict';

    $(function () {

        console.log('billboardAbstractModule');
        const billboardAbstractModule = {

            routeUrl : function (route) {
                return $.billboard.routeUrl(route);
            }

        };


        // $.bill = {
        //
        //     APP_ID : 'billboard',
        //
        //     backendUrl : function () {
        //         return window.backend_url;
        //     },
        //
        //     appUrl : function () {
        //         return this.backendUrl() + this.APP_ID + '/';
        //     },
        //
        //     routeUrl : function (route) {
        //         return this.appUrl() + route;
        //     }
        //
        // };

    });

}(jQuery, window, document));
