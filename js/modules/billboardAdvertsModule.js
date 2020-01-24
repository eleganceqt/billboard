(function ($, window, document) {

    'use strict';

    $(function () {

        const module = {

            $wrapper : $('#billboardAdverts__wrapper'),

            skeleton : {

                attributes : {
                    namespace : {
                        module : 'billboardAdverts'
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
                        input : '.billboardAdverts__search-input',
                        toggler : '.billboardAdverts__search-button',
                        partnersDropdown : '.ui.dropdown.partners-dropdown',
                        citiesDropdown : '.ui.dropdown.cities-dropdown',
                        categoriesDropdown : '.ui.dropdown.categories-dropdown'
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
                            onToggler : function (event) {

                                console.warn('onToggler(e) invoked.', { event });

                                $('.filter-row').transition('fade down');
                            }
                        }
                    },

                    serialize : {
                        query : function () {
                            return $.trim($(module.components.search.selector.input).val());
                        },
                        partners : function () {

                            let values = [];

                            let dropdownValue = $.trim($(module.components.search.selector.partnersDropdown).dropdown('get value'));

                            if (dropdownValue !== '') {
                                values = dropdownValue.split(',');
                            }

                            return values;
                        },
                        cities : function () {

                            let values = [];

                            let dropdownValue = $.trim($(module.components.search.selector.citiesDropdown).dropdown('get value'));

                            if (dropdownValue !== '') {
                                values = dropdownValue.split(',');
                            }

                            return values;
                        },
                        categories : function () {

                            let values = [];

                            let dropdownValue = $.trim($(module.components.search.selector.categoriesDropdown).dropdown('get value'));

                            if (dropdownValue !== '') {
                                values = dropdownValue.split(',');
                            }

                            return values;
                        }
                    }
                },

                modal : {

                    selector : {
                        element : '.billboardAdverts__modal',
                        save : '.billboardAdverts__modal--save-button',
                        file : 'input[name="file"]',
                        uploadImages : '.upload-images',
                        deleteImage : '.delete-image'
                    },

                    route : {
                        update : 'adverts/update/',
                        uploadImages : 'adverts/uploadImages/',
                        deleteImage : 'adverts/deleteImage/',
                        sortImages : 'adverts/sortImages/'
                    },

                    event : {
                        change : {
                            onFile : function (event) {

                                let $input = $(this);

                                let $button = $input.next('.upload-images');

                                module.skeleton.methods.set.loading($button);

                                let limit = 5 - $('.advert-images > .card').length;

                                let files = Object.values(this.files).filter(module.components.modal.isImage).slice(0, limit);

                                let data = new FormData();

                                data.append('id', module.components.modal.serialize.id());

                                $.each(files, function (_, file) {
                                    data.append('images[]', file);
                                });

                                $.ajax({
                                           url : module.skeleton.methods.routeUrl(module.components.modal.route.uploadImages),
                                           data : data,
                                           method : 'POST',
                                           async : true,
                                           cache : false,
                                           contentType : false,
                                           processData : false,
                                           dataType : 'json',
                                           error : function (jqXHR, textStatus, errorThrown) {
                                               alert(module.skeleton.attributes.messages.internalError);
                                           },
                                           success : function (response, textStatus, jqXHR) {

                                               if (response.status === 'ok') {

                                                   if (response.data.files !== undefined) {

                                                       $.each(response.data.files, function (_, file) {

                                                           module.components.modal.images.add(file);

                                                       });
                                                   }
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
                        },

                        click : {
                            onSave : function (event) {

                                let $button = $(event.currentTarget);

                                module.skeleton.methods.set.loading($button);
                                module.components.modal.message.remove();

                                let data = {
                                    id : module.components.modal.serialize.id(),
                                    status : module.components.modal.serialize.status(),
                                    title : module.components.modal.serialize.title(),
                                    category_id : module.components.modal.serialize.categoryId(),
                                    city_id : module.components.modal.serialize.cityId(),
                                    price : module.components.modal.serialize.price(),
                                    description : module.components.modal.serialize.description()
                                };

                                $.ajax({
                                           url : module.skeleton.methods.routeUrl(module.components.modal.route.update),
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

                                               let $content = $button.closest('.modal').find('.content');
                                               let $message = $('.billboardAdverts__modal--message-field');

                                               $content.animate({
                                                                    scrollTop : $message.offset().top - $content.offset().top + $content.scrollTop()
                                                                });

                                               module.skeleton.methods.unset.loading($button);
                                           }

                                       });

                            },

                            onImageUpload : function (event) {

                                let $button = $(event.currentTarget);

                                // module.skeleton.methods.set.loading($button);

                                $button.prev('input[type="file"]').click();

                            },

                            onImageDelete : function (event) {

                                let $button = $(event.currentTarget);

                                module.skeleton.methods.set.loading($button);

                                let data = {
                                    image_id : $button.closest('.card').data('image-id')
                                };

                                $.ajax({
                                           url : module.skeleton.methods.routeUrl(module.components.modal.route.deleteImage),
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
                                                   $button.closest('.card').remove();
                                                   // module.components.modal.message.show.success();
                                               }

                                               if (response.status === 'fail') {
                                                   // module.components.modal.message.show.error(response.errors);
                                               }

                                           },
                                           complete : function (jqXHR, textStatus) {
                                               module.skeleton.methods.unset.loading($button);
                                           }

                                       });
                            }
                        },
                        custom : {
                            onSortable : function (advertId, sort) {

                                let data = {
                                    advert_id : advertId,
                                    sort : sort
                                };

                                $.ajax({
                                           url : module.skeleton.methods.routeUrl(module.components.modal.route.sortImages),
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
                                                   // ...
                                               }

                                               if (response.status === 'fail') {
                                                   // ...
                                               }

                                           },
                                           complete : function (jqXHR, textStatus) {
                                               // ...
                                           }
                                       })
                                ;

                            }
                        }
                    },

                    isImage : function (file) {
                        return file.type.split('/')[0] === 'image'
                    },

                    images : {

                        add : function (file) {

                            let content = module.components.modal.mock.image(file);

                            $('.advert-images').append(content);
                        }
                    },

                    events : {
                        bind : {
                            all : function () {
                                this.direct();
                                this.delegated();
                                this.custom();
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
                                        'change' + module.skeleton.computed.namespace.event(),
                                        module.components.modal.selector.file,
                                        module.components.modal.event.change.onFile
                                    )

                                    .on(
                                        'click' + module.skeleton.computed.namespace.event(),
                                        module.components.modal.selector.uploadImages + module.skeleton.attributes.selector.notLoading,
                                        module.components.modal.event.click.onImageUpload
                                    )

                                    .on(
                                        'click' + module.skeleton.computed.namespace.event(),
                                        module.components.modal.selector.deleteImage + module.skeleton.attributes.selector.notLoading,
                                        module.components.modal.event.click.onImageDelete
                                    )

                                    .on(
                                        'click' + module.skeleton.computed.namespace.event(),
                                        module.components.modal.message.selector.icon,
                                        module.components.modal.message.event.click.onDismiss
                                    )
                                ;
                            },
                            custom : function () {

                                let $modal = module.components.modal.get();

                                let settings = {
                                    // axis : 'x',
                                    items : '.advert-images .card',
                                    tolerance : 'pointer',
                                    helper : function (event, $element) {

                                        $element.children().each(function (index, children) {

                                            let $children = $(children);

                                            $children.width($children.width());
                                        });

                                        return $element;
                                    },
                                    start : function (event, ui) {

                                        let placeholderHeight = ui.item.outerHeight();

                                        ui.placeholder.height(placeholderHeight);

                                        $('<div class="sortable-item-placeholder" data-height="' + placeholderHeight + '"></div>').insertAfter(ui.placeholder);

                                    },
                                    stop : function (event, ui) {

                                        $('.sortable-item-placeholder').remove();

                                        let advertId = $modal.find('input[type="hidden"][name="id"]').val();

                                        let serialized = $modal.sortable('toArray', { attribute : 'data-image-id' });

                                        module.components.modal.event.custom.onSortable(advertId, serialized);
                                    }
                                };

                                $modal.sortable(settings).disableSelection();
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
                                statusDropdown : '.ui.status.dropdown',
                                categoriesDropdown : '.ui.categories.dropdown',
                                citiesDropdown : '.ui.cities.dropdown'
                            },
                            settings : {
                                selectOnKeydown : false,
                                forceSelection : false,
                                showOnFocus : false,
                                allowTab : false
                            },
                            init : function () {

                                let $modal = module.components.modal.get();

                                $modal.find(this.selector.statusDropdown).dropdown(this.settings);
                                $modal.find(this.selector.categoriesDropdown).dropdown(this.settings);
                                $modal.find(this.selector.citiesDropdown).dropdown(this.settings);
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
                            element : '.billboardAdverts__modal-placeholder'
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
                            placeholder : '.billboardAdverts__modal--message-field',
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
                        },
                        image : function (image) {

                            let content = `<div class="card" data-image-id="${image.id}">
                                               <div class="content">
                                                   <div class="ui fluid image">
                                                       <img src="${image.url}" alt="">
                                                   </div>
                                               </div>
                                               <div class="ui bottom attached bttn delete-image">Удалить</div>
                                           </div>`;

                            return content;
                        }

                    },

                    serialize : {
                        id : function () {
                            return $.trim($(module.components.modal.selector.element).find('input[name="id"]').val());
                        },
                        status : function () {
                            return $.trim($(module.components.modal.selector.element).find('.ui.status.dropdown').dropdown('get value'));
                        },
                        title : function () {
                            return $.trim($(module.components.modal.selector.element).find('input[name="title"]').val());
                        },
                        categoryId : function () {
                            return $.trim($(module.components.modal.selector.element).find('.ui.categories.dropdown').dropdown('get value'));
                        },
                        cityId : function () {
                            return $.trim($(module.components.modal.selector.element).find('.ui.cities.dropdown').dropdown('get value'));
                        },
                        price : function () {
                            return $.trim($(module.components.modal.selector.element).find('input[name="price"]').val());
                        },
                        description : function () {
                            return $.trim($(module.components.modal.selector.element).find('textarea[name="description"]').val());
                        }
                    }
                },

                table : {

                    selector : {
                        element : '#billboardAdverts__table',
                        sortable : '#billboardAdverts__table thead th:not(.not-sortable)',
                        status : '.toggle.status.icon',
                        edit : '.billboardAdverts__table--edit-advert-bttn',
                        remove : '.billboardAdverts__table--remove-advert-bttn',
                        actionsCell : 'td:eq(6)',

                        pagination : {
                            page : '.billboardAdverts__table-page'
                        }
                    },

                    route : {
                        refine : 'adverts/refine/',
                        toggleOn : 'adverts/show/',
                        toggleOff : 'adverts/hide/',
                        edit : 'adverts/edit/',
                        update : 'adverts/update/',
                        delete : 'adverts/delete/',
                        paginate : 'adverts/paginate/'
                    },

                    event : {
                        click : {
                            onStatus : function (event) {

                                console.warn('onStatus(e) invoked.', { event });

                                let $icon = $(this);

                                let oldStatus = $icon.hasClass('on') ? 'on' : 'off';

                                $icon.removeClass('red green toggle on off').addClass('spinner loading');

                                let route = (oldStatus === 'on' ? module.components.table.route.toggleOff : module.components.table.route.toggleOn);

                                let data = {
                                    advert_id : $icon.closest('tr').data('advert-id')
                                };

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

                                                   if (oldStatus === 'on') {
                                                       $icon.removeClass('spinner loading').addClass('red toggle off');
                                                   }

                                                   if (oldStatus === 'off') {
                                                       $icon.removeClass('spinner loading').addClass('green toggle on');
                                                   }
                                               }

                                               if (response.status === 'fail') {
                                                   // module.components.modal.message.show.error(response.errors);
                                               }

                                           },
                                           complete : function (jqXHR, textStatus) {
                                               module.skeleton.methods.unset.loading($button);
                                           }

                                       });
                            },

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
                                    id : $button.closest('tr').data('advert-id')
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
                                    id : $button.closest('tr').data('advert-id')
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

                                module.components.table.dimmer.show();

                                module.skeleton.attributes.shared.jqXHR.abort();

                                let data = {
                                    query : module.components.search.serialize.query(),
                                    partners : module.components.search.serialize.partners(),
                                    cities : module.components.search.serialize.cities(),
                                    categories : module.components.search.serialize.categories(),
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
                        return $(this.selector.element).find('tr[data-advert-id="' + id + '"]');
                    },

                    get : function () {
                        return $(this.selector.element);
                    },

                    dimmer : {
                        selector : {
                            element : '.billboardAdverts__table-dimmer'
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
                                  module.components.search.selector.toggler + module.skeleton.attributes.selector.notLoading,
                                  module.components.search.event.click.onToggler
                              )

                              .on(
                                  'click' + eventnamespace,
                                  module.components.table.selector.status + module.skeleton.attributes.selector.notLoading,
                                  module.components.table.event.click.onStatus
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

            semantic : {
                initialize : function () {
                    this.elements.dropdown.initialize();
                },
                elements : {
                    dropdown : {
                        settings : {
                            clearable : true,
                            selectOnKeydown : false,
                            forceSelection : false,
                            useLabels : false,
                            showOnFocus : false,
                            allowTab : false,
                            // fullTextSearch : true,
                            match : 'text',
                            message : {
                                count : '{count} выбрано',
                                noResults : 'Результатов не найдено.'
                            },
                            onChange : function (value, text, $choice) {

                                let $dropdown = $(this);

                                /**
                                 * When $choice is string (HTML), that means item was selected.
                                 * When $choice is object (jqObject), that means item was unselected.
                                 * When $choice is undefined, that means dropdown was cleared.
                                 */

                                if (typeof $choice === 'object') {
                                    $choice.find('.ui.checkbox').checkbox('uncheck');
                                }

                                if (typeof $choice === 'string') {
                                    $dropdown.find('.items-menu .item[data-value="' + text + '"] .ui.checkbox').checkbox('check');
                                }

                                if (typeof $choice === 'undefined') {
                                    $dropdown.find('.ui.checkbox.checked').checkbox('uncheck');
                                }

                                module.$wrapper.trigger('refine');
                            }
                        },
                        partners : {
                            init : function () {
                                $(module.components.search.selector.partnersDropdown).dropdown(module.semantic.elements.dropdown.settings);
                            }
                        },
                        cities : {
                            init : function () {
                                $(module.components.search.selector.citiesDropdown).dropdown(module.semantic.elements.dropdown.settings);
                            }
                        },
                        categories : {
                            init : function () {
                                $(module.components.search.selector.categoriesDropdown).dropdown(module.semantic.elements.dropdown.settings);
                            }
                        },
                        initialize : function () {
                            this.partners.init();
                            this.cities.init();
                            this.categories.init();
                        }
                    }
                }
            },

            initialize : function () {

                this.semantic.initialize();

                this.events.bind.all();
            }

        };

        module.initialize();

    });

}(jQuery, window, document));
