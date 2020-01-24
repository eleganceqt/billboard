(function ($, window, document) {

    'use strict';

    $(function () {

        let $document = $(document);

        const module = {

            skeleton : {
                attributes : {
                    namespace : {
                        module : 'billboardFavorite'
                    },
                    messages : {
                        internalError : '500 Internal Server Error'
                    }
                },
                computed : {
                    namespace : {
                        event : function () {
                            return '.' + module.skeleton.attributes.namespace.module
                        }
                    }
                }
            },

            components : {

                favorite : {

                    selector : {
                        star : '.star.user'
                    },

                    event : {
                        click : {

                            onStar : function (event) {

                                let $star = $(this);

                                let routeUrl = ($star.attr('data-style') === 'empty' ? $star.data('add-url') : $star.data('remove-url'));

                                $.ajax({
                                           url : routeUrl,
                                           data : {
                                               _csrf : $.cookie('_csrf')
                                           },
                                           method : 'POST',
                                           async : true,
                                           cache : false,
                                           processData : true,
                                           dataType : 'json',
                                           error : function (jqXHR, textStatus, errorThrown) {
                                               alert(module.skeleton.attributes.messages.internalError);
                                           },
                                           success : function (response, textStatus, jqXHR) {

                                               if (response.status === 'ok') {

                                                   let newStyle = ($star.attr('data-style') === 'empty' ? 'fill' : 'empty');

                                                   $star.attr('data-style', newStyle);
                                               }

                                               if (response.status === 'fail') {
                                                   // ...
                                               }

                                           },
                                           complete : function (jqXHR, textStatus) {
                                               // ...
                                           }

                                       });
                            }
                        }
                    }
                }

            },

            events : {
                bind : {
                    all : function () {
                        this.direct();
                        this.delegated();
                    },
                    direct : function () {
                        // ...
                    },
                    delegated : function () {

                        let eventnamespace = module.skeleton.computed.namespace.event();

                        $document
                            .on(
                                'click' + eventnamespace,
                                module.components.favorite.selector.star,
                                module.components.favorite.event.click.onStar
                            )
                        ;
                    }
                }
            },


            initialize : function () {
                this.events.bind.all();
            }

        };

        module.initialize();

    });

}(jQuery, window, document));
