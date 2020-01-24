(function ($, window, document) {

    'use strict';

    $(function () {

        const module = {

            $wrapper : $('.billboard__account-adverts-wrapper'),

            skeleton : {

                attributes : {
                    namespace : {
                        module : 'billboardAccountAdverts'
                    },
                    selector : {
                        notLoading : ':not(.loading)',
                        notDisabled : ':not(.disabled)'
                    },
                    className : {
                        loading : 'loading',
                        disabled : 'disabled'
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
                },

                methods : {

                    set : {
                        loading : function ($element) {
                            $element.addClass(module.skeleton.attributes.className.loading);
                        }
                    },

                    unset : {
                        loading : function ($element) {
                            $element.removeClass(module.skeleton.attributes.className.loading);
                        }
                    }
                }
            },

            components : {

                list : {
                    selector : {
                        edit : 'edit-advert',
                        show : '.show-advert',
                        hide : '.hide-advert',
                        delete : '.delete-advert'
                    },

                    event : {
                        click : {
                            onShow : function (event) {

                                let $icon = $(this);

                                let routeUrl = $icon.data('show-url');

                                $icon.removeClass('eye').addClass('spinner loading');

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

                                               $icon.addClass('eye');
                                           },
                                           success : function (response, textStatus, jqXHR) {

                                               if (response.status === 'ok') {

                                                   $icon.removeClass('show-advert').addClass('eye slash hide-advert');

                                                   $icon.attr('title', 'Скрыть');

                                                   $icon.closest('li').removeClass('disabled');
                                               }

                                               if (response.status === 'fail') {
                                                   $icon.addClass('eye');
                                               }

                                           },
                                           complete : function (jqXHR, textStatus) {
                                               $icon.removeClass('spinner loading');
                                           }

                                       });
                            },

                            onHide : function (event) {

                                let $icon = $(this);

                                let routeUrl = $icon.data('hide-url');

                                $icon.removeClass('eye slash').addClass('spinner loading');

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

                                               $icon.addClass('eye slash');
                                           },
                                           success : function (response, textStatus, jqXHR) {

                                               if (response.status === 'ok') {

                                                   $icon.removeClass('hide-advert').addClass('eye show-advert');

                                                   $icon.attr('title', 'Показать');

                                                   $icon.closest('li').addClass('disabled');
                                               }

                                               if (response.status === 'fail') {
                                                   $icon.addClass('eye slash');
                                               }

                                           },
                                           complete : function (jqXHR, textStatus) {
                                               $icon.removeClass('spinner loading');
                                           }

                                       });
                            },

                            onDelete : function (event) {

                                let $icon = $(this);

                                if (confirm('Вы уверены что хотите удалить объявление?')) {

                                    let routeUrl = $icon.data('delete-url');

                                    $icon.removeClass('trash alternate').addClass('spinner loading');

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

                                                   $icon.addClass('trash alternate');
                                               },
                                               success : function (response, textStatus, jqXHR) {

                                                   if (response.status === 'ok') {

                                                       // $icon.removeClass('hide-advert').addClass('eye show-advert');

                                                       // $icon.attr('title', 'Показать');

                                                       $icon.closest('li').remove();
                                                   }

                                                   if (response.status === 'fail') {
                                                       $icon.addClass('trash alternate');
                                                   }

                                               },
                                               complete : function (jqXHR, textStatus) {
                                                   $icon.removeClass('spinner loading');
                                               }

                                           });
                                }
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

                        module.$wrapper

                              .on(
                                  'click' + eventnamespace,
                                  module.components.list.selector.hide + module.skeleton.attributes.selector.notLoading,
                                  module.components.list.event.click.onHide
                              )

                              .on(
                                  'click' + eventnamespace,
                                  module.components.list.selector.show + module.skeleton.attributes.selector.notLoading,
                                  module.components.list.event.click.onShow
                              )

                              .on(
                                  'click' + eventnamespace,
                                  module.components.list.selector.delete + module.skeleton.attributes.selector.notLoading,
                                  module.components.list.event.click.onDelete
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
