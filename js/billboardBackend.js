(function ($, window, document) {

    $(function () {

        const billboardBackendAction = {

            dom : {
                $wrapper : $('#wa-billboard-app')
            },

            initialize : function () {

                // this.initializeSemanticUI();

                // this.addEventListeners();
            },

            initializeSemanticUI : function () {
                this.initializeTabComponent();
            },

            initializeTabComponent : function () {

                let that = this;

                $('.sidebar-menu .item[data-tab="adverts"]')
                    .tab({

                             // debug: true,
                             // verbose: true,

                             cache: false,
                             // faking API request
                             apiSettings: {
                                 loadingDuration : 300,
                                 url: '/easd/'
                             },
                             evaluateScripts: 'once',
                             alwaysRefresh: false,
                             context : $('#wa-billboard-app'),
                             auto    : true,
                             path    : '/webasyst/billboard/'
                         })
                ;

                $('.sidebar-menu .item[data-tab="partners"]')
                    .tab({

                             // debug: true,
                             // verbose: true,

                             evaluateScripts: 'once',
                             alwaysRefresh: false,
                             cache: false,
                             apiSettings: {
                                 loadingDuration : 300,
                                 url: '/easd/'
                             },
                             context : $('#wa-billboard-app'),
                             auto    : true,
                             path    : '/webasyst/billboard/'
                         })
                ;

            },

            addEventListeners : function () {

            }
        };

        billboardBackendAction.initialize();

    });

}(jQuery, window, document));
