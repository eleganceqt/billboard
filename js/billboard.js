(function ($, window, document) {

    'use strict';

    $(function () {

        $.billboard = {

            APP_ID : 'billboard',

            backendUrl : function () {
                return window.backend_url;
            },

            appUrl : function () {
                return this.backendUrl() + this.APP_ID + '/';
            },

            routeUrl : function (route) {
                return this.appUrl() + route;
            }

        };

    });

}(jQuery, window, document));
