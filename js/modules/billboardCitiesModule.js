(function ($, window, document) {

    'use strict';

    $(function () {

        const module = {

            $wrapper : $('#billboardCities__wrapper'),

            skeleton : {

                attributes : {
                    namespace : {
                        module : 'billboardCities'
                    },
                    selector : {
                        notLoading : ':not(.loading)',
                        notActive : ':not(.active)',
                        notDisabled : ':not(.disabled)'
                    },
                    className : {
                        loading : 'loading',
                        disabled : 'disabled'
                    },

                    messages : {
                        internalError : '500 Internal Server Error'
                    },

                    shared : {
                        timer : null,
                        jqXHR : {
                            abort : function () {
                                // ...
                            }
                        }
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
                        },
                        disabled : function ($element) {
                            $element.addClass(module.skeleton.attributes.className.disabled);
                        }
                    },

                    unset : {
                        loading : function ($element) {
                            $element.removeClass(module.skeleton.attributes.className.loading);
                        },
                        disabled : function ($element) {
                            $element.removeClass(module.skeleton.attributes.className.disabled);
                        }
                    },

                    unless : {
                        abort : function (textStatus, callback) {
                            if (textStatus !== 'abort') {
                                callback();
                            }
                        }
                    },

                    routeUrl : function (route) {
                        return $.billboard.routeUrl(route);
                    }
                }
            },

            components : {

                search : {

                    selector : {
                        input : '.billboardCities__search-input',
                        button : '.billboardCities__search--add-city-button'
                    },

                    route : {
                        create : 'cities/create/'
                    },

                    event : {

                        input : {
                            onSearch : function (event) {

                                console.warn('onSearch(e) invoked.', { event });

                                if (module.skeleton.attributes.shared.timer !== null) {
                                    clearTimeout(module.skeleton.attributes.shared.timer);
                                }

                                module.skeleton.attributes.shared.timer = setTimeout(function () {
                                    module.$wrapper.trigger('refine');
                                }, 400)
                            }
                        },

                        click : {
                            onCreate : function (event) {

                                console.warn('onCreate(e) invoked.', { event });

                                let $button = $(event.currentTarget);

                                module.skeleton.methods.set.loading($button);

                                $.ajax({
                                           url : module.skeleton.methods.routeUrl(module.components.search.route.create),
                                           data : { id : 'new' },
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
                                                   module.components.modal.boot(response.data.content);
                                               }

                                               if (response.status === 'fail') {
                                                   // ...
                                               }

                                           },
                                           complete : function (jqXHR, textStatus) {
                                               module.skeleton.methods.unset.loading($button);
                                           }
                                       })
                                ;
                            }
                        }
                    },

                    serialize : {
                        query : function () {
                            return $.trim($(module.components.search.selector.input).val());
                        }
                    }
                },

                modal : {

                    selector : {
                        element : '.billboardCities__modal',
                        save : '.billboardCities__modal--save-button'
                    },

                    route : {
                        store : 'cities/store/',
                        update : 'cities/update/'
                    },

                    event : {
                        click : {
                            onSave : function (event) {

                                let $button = $(event.currentTarget);

                                module.skeleton.methods.set.loading($button);
                                module.components.modal.message.remove();

                                let data = {
                                    id : module.components.modal.serialize.id(),
                                    name : module.components.modal.serialize.name(),
                                    ranking : module.components.modal.serialize.ranking()
                                };

                                let route = data.id === 'new'
                                            ? module.components.modal.route.store
                                            : module.components.modal.route.update;

                                $.ajax({
                                           url : module.skeleton.methods.routeUrl(route),
                                           data : data,
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
                                                   module.components.modal.message.show.success();
                                               }

                                               if (response.status === 'fail') {
                                                   module.components.modal.message.show.error(response.errors);
                                               }

                                           },
                                           complete : function (jqXHR, textStatus) {
                                               module.skeleton.methods.unset.loading($button);
                                           }

                                       });

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

                            },
                            delegated : function () {

                                let $modal = module.components.modal.get();

                                $modal

                                    .on(
                                        'click' + module.skeleton.computed.namespace.event(),
                                        module.components.modal.selector.save + module.skeleton.attributes.selector.notLoading,
                                        module.components.modal.event.click.onSave
                                    )

                                    .on(
                                        'click' + module.skeleton.computed.namespace.event(),
                                        module.components.modal.message.selector.icon,
                                        module.components.modal.message.event.click.onDismiss
                                    )
                                ;
                            }
                        }

                    },

                    settings : {
                        autofocus : false,
                        restoreFocus : false,
                        observeChanges : false,
                        keyboardShortcuts : false,
                        closable : false,
                        duration : 300,
                        onShow : function () {
                            module.components.modal.callbacks.onShow();
                        },
                        onHidden : function () {
                            module.components.modal.callbacks.onHidden();
                        }
                    },

                    callbacks : {
                        onShow : function () {
                            module.components.modal.elements.initialize();
                            module.components.modal.events.bind.all();
                        },
                        onHidden : function () {
                            module.components.modal.get().remove();
                        }
                    },

                    elements : {
                        initialize : function () {
                            this.dropdown.init();
                        },
                        dropdown : {
                            selector : {
                                countryDropdown : '.billboardCities__modal--country-dropdown'
                            },
                            settings : {
                                selectOnKeydown : false,
                                forceSelection : false,
                                showOnFocus : false,
                                allowTab : false,
                                fullTextSearch : true
                            },
                            init : function () {
                                module.components.modal.get().find(this.selector.countryDropdown).dropdown(this.settings);
                            }
                        }
                    },

                    boot : function (content) {

                        this.placeholder.content(content);

                        this.activate();
                    },

                    activate : function () {
                        this.get().modal(this.settings).modal('show');
                    },

                    get : function () {
                        return $(this.selector.element);
                    },

                    placeholder : {
                        selector : {
                            element : '.billboardCities__modal-placeholder'
                        },
                        content : function (content) {
                            this.get().html(content);
                        },
                        get : function () {
                            return $(this.selector.element);
                        }
                    },

                    message : {
                        selector : {
                            placeholder : '.billboardCities__modal--message-field',
                            icon : '.dismiss-icon'
                        },

                        show : {
                            error : function (errors) {

                                let content = module.components.modal.mock.message.error(errors);

                                $(module.components.modal.message.selector.placeholder).html(content)
                                                                                       .find('.message')
                                                                                       .transition('fade');
                            },
                            success : function () {

                                let content = module.components.modal.mock.message.success();

                                $(module.components.modal.message.selector.placeholder).html(content)
                                                                                       .find('.message')
                                                                                       .transition('fade');
                            }
                        },

                        event : {
                            click : {
                                onDismiss : function (event) {
                                    module.components.modal.message.remove();
                                }
                            }
                        },

                        remove : function () {
                            $(this.selector.placeholder).empty();
                        }
                    },

                    mock : {
                        message : {
                            error : function (errors) {

                                let list = this.list(errors);

                                let content = `<div class="ui error hidden message">
                                                   <i class="close icon dismiss-icon"></i>
                                                   <div class="header">
                                                       При сохранении формы были обнаружены ошибки:
                                                   </div>
                                                   <ul class="list">${list}</ul>
                                               </div>`;

                                return content;
                            },
                            success : function () {

                                let content = `<div class="ui success hidden message">
                                                   <i class="close icon dismiss-icon"></i>
                                                   <div class="header">
                                                       Сохранено.
                                                   </div>
                                                  <p>Введенные данные были успешно сохранены.</p>
                                               </div>`;

                                return content;
                            },
                            list : function (items) {

                                let content = ``;

                                $.each(items, function (index, message) {
                                    content += `<li>${message}</li>`;
                                });

                                return content;
                            }
                        }
                    },

                    serialize : {
                        id : function () {
                            return $.trim($(module.components.modal.selector.element).find('input[name="id"]').val());
                        },
                        name : function () {
                            return $.trim($(module.components.modal.selector.element).find('input[name="name"]').val());
                        },
                        ranking : function () {
                            return $.trim($(module.components.modal.selector.element).find('input[name="ranking"]').val());
                        }
                    }
                },

                table : {

                    selector : {
                        element : '#billboardCities__table',
                        sortable : '#billboardCities__table thead th:not(.not-sortable)',
                        edit : '.billboardCities__table--edit-city-bttn',
                        remove : '.billboardCities__table--remove-city-bttn',
                        actionsCell : 'td:eq(4)',
                        pagination : {
                            page : '.billboardCities__table-page'
                        }
                    },

                    route : {
                        refine : 'cities/refine/',
                        edit : 'cities/edit/',
                        delete : 'cities/delete/',
                        paginate : 'cities/paginate/'
                    },

                    event : {
                        click : {
                            onSort : function (event) {

                                console.warn('onSort(e) invoked.', { event });

                                let $th = $(event.currentTarget);

                                $th.closest('tr').find('th').not($th).removeClass('sorted ascending descending');

                                if ($th.hasClass('sorted')) {

                                    if ($th.hasClass('ascending')) {
                                        $th.toggleClass('ascending descending');
                                    } else {
                                        $th.removeClass('sorted ascending descending');
                                    }

                                } else {
                                    $th.addClass('sorted ascending');
                                }

                                module.$wrapper.trigger('refine');
                            },

                            onEdit : function (event) {

                                console.warn('onEdit(e) invoked.', { event });

                                let $button = $(event.currentTarget);

                                module.skeleton.methods.set.loading($button);

                                let data = {
                                    id : $button.closest('tr').data('city-id')
                                };

                                $.ajax({
                                           url : module.skeleton.methods.routeUrl(module.components.table.route.edit),
                                           data : data,
                                           method : 'POST',
                                           async : true,
                                           cache : false,
                                           processData : true,
                                           dataType : 'json',
                                           error : function (jqXHR, textStatus, errorThrown) {

                                           },
                                           success : function (response, textStatus, jqXHR) {

                                               if (response.status === 'ok') {
                                                   module.components.modal.boot(response.data.content);
                                               }

                                               if (response.status === 'fail') {
                                                   // alert(response.errors);
                                               }

                                           },
                                           complete : function (jqXHR, textStatus) {
                                               module.skeleton.methods.unset.loading($button);
                                           }

                                       });

                            },

                            onDelete : function (event) {

                                console.warn('onDelete(e) invoked.', { event });

                                let $button = $(event.currentTarget);

                                module.skeleton.methods.set.loading($button);

                                let data = {
                                    id : $button.closest('tr').data('city-id')
                                };

                                $.ajax({
                                           url : module.skeleton.methods.routeUrl(module.components.table.route.delete),
                                           data : data,
                                           method : 'POST',
                                           async : true,
                                           cache : false,
                                           processData : true,
                                           dataType : 'json',
                                           error : function (jqXHR, textStatus, errorThrown) {

                                           },
                                           success : function (response, textStatus, jqXHR) {

                                               if (response.status === 'ok') {
                                                   module.components.table.remove(data.id);
                                               }

                                               if (response.status === 'fail') {
                                                   // alert(response.errors);
                                               }

                                           },
                                           complete : function (jqXHR, textStatus) {
                                               module.skeleton.methods.unset.loading($button);
                                           }

                                       });

                            },

                            onPage : function (event) {

                                console.warn('onPage(e) invoked.', { event });

                                let $item = $(event.currentTarget);

                                let page = $item.data('page');

                                module.$wrapper.trigger('refine', [page]);
                            }
                        },
                        custom : {
                            onRefine : function (event, page) {

                                console.warn('onRefine(e) invoked.', { event });

                                console.log(page);

                                module.components.table.dimmer.show();

                                module.skeleton.attributes.shared.jqXHR.abort();

                                let data = {
                                    query : module.components.search.serialize.query(),
                                    sort_column : module.components.table.serialize.sort.column(),
                                    sort_direction : module.components.table.serialize.sort.direction(),
                                    page : page || 1
                                };

                                module.skeleton.attributes.shared.jqXHR = $.ajax({
                                                                                     url : module.skeleton.methods.routeUrl(module.components.table.route.refine),
                                                                                     data : data,
                                                                                     method : 'POST',
                                                                                     async : true,
                                                                                     cache : false,
                                                                                     processData : true,
                                                                                     dataType : 'json',
                                                                                     error : function (jqXHR, textStatus, errorThrown) {
                                                                                         module.skeleton.methods.unless.abort(textStatus, function () {
                                                                                             alert('err');
                                                                                         });
                                                                                     },
                                                                                     success : function (response, textStatus, jqXHR) {

                                                                                         if (response.status === 'ok') {
                                                                                             module.components.table.replace(response.data.content);
                                                                                         }

                                                                                         if (response.status === 'fail') {

                                                                                         }

                                                                                     },
                                                                                     complete : function (jqXHR, textStatus) {
                                                                                         module.skeleton.methods.unless.abort(textStatus, function () {
                                                                                             module.components.table.dimmer.hide();
                                                                                         });
                                                                                     }
                                                                                 });

                            },

                            onPaginate : function (event, page) {

                                console.log({ event, page });

                            }
                        }
                    },

                    replace : function (content) {

                        let $table = this.get();

                        let $content = $(content);

                        $table.html($content.find('table').html());
                    },

                    remove : function (id) {

                        let $row = this.row(id);

                        this.disable($row);

                        this.labelAsRemoved($row);
                    },

                    disable : function ($row) {
                        module.skeleton.methods.set.disabled($row);
                    },

                    labelAsRemoved : function ($row) {
                        $row.find(module.components.table.selector.actionsCell).html(module.components.table.mock.label.removed());
                    },

                    row : function (id) {
                        return $(this.selector.element).find('tr[data-city-id="' + id + '"]');
                    },

                    get : function () {
                        return $(this.selector.element);
                    },

                    dimmer : {
                        selector : {
                            element : '.billboardCities__table-dimmer'
                        },
                        settings : {
                            closable : false,
                            on : false,
                            duration : 400
                        },
                        show : function () {
                            this.get().dimmer(this.settings).dimmer('show');

                        },
                        hide : function () {
                            this.get().dimmer(this.settings).dimmer('hide');
                        },
                        get : function () {
                            return $(this.selector.element);
                        }
                    },

                    mock : {
                        label : {
                            removed :
                                function () {
                                    return `<a class="ui red label">Удалено</a>`;
                                }
                        }
                    },

                    serialize : {
                        sort : {
                            column : function () {

                                let $active = this.active();

                                if ($active.length) {
                                    return $active.data('column');
                                }
                            },
                            direction : function () {

                                let $active = this.active();

                                if ($active.length) {
                                    return $active.hasClass('ascending') ? 'asc' : 'desc';
                                }
                            },
                            active : function () {
                                return $(module.components.table.selector.sortable + '.sorted');
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

                        let eventnamespace = module.skeleton.computed.namespace.event();

                        module.$wrapper

                              .on(
                                  'refine' + eventnamespace,
                                  module.components.table.event.custom.onRefine
                              )

                              .on(
                                  'paginate' + eventnamespace,
                                  module.components.table.event.custom.onPaginate
                              )

                        ;

                    },
                    delegated : function () {

                        let eventnamespace = module.skeleton.computed.namespace.event();

                        module.$wrapper

                              .on(
                                  'input' + eventnamespace,
                                  module.components.search.selector.input,
                                  module.components.search.event.input.onSearch
                              )

                              .on(
                                  'click' + eventnamespace,
                                  module.components.search.selector.button + module.skeleton.attributes.selector.notLoading,
                                  module.components.search.event.click.onCreate
                              )

                              .on(
                                  'click' + eventnamespace,
                                  module.components.table.selector.sortable,
                                  module.components.table.event.click.onSort
                              )

                              .on(
                                  'click' + eventnamespace,
                                  module.components.table.selector.edit + module.skeleton.attributes.selector.notLoading,
                                  module.components.table.event.click.onEdit
                              )

                              .on(
                                  'click' + eventnamespace,
                                  module.components.table.selector.remove + module.skeleton.attributes.selector.notLoading,
                                  module.components.table.event.click.onDelete
                              )

                              .on(
                                  'click' + eventnamespace,
                                  module.components.table.selector.pagination.page + module.skeleton.attributes.selector.notActive + module.skeleton.attributes.selector.notDisabled,
                                  module.components.table.event.click.onPage
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
