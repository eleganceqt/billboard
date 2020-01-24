(function ($, window, document) {

    'use strict';

    $(function () {

        const module = {

            $wrapper : $('.billboard__advert-edit-wrapper'),

            skeleton : {

                attributes : {
                    namespace : {
                        module : 'billboardAdvertEdit'
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

                form : {

                    selector : {
                        form : '.billboard__advert-edit-form',
                        title : 'input[name="title"]',
                        category : '.ui.categories.dropdown',
                        city : '.ui.city.dropdown',
                        price : 'input[name="price"]',
                        description : 'textarea[name="description"]',
                        file : 'input[name="file"]',

                        deleteImage : '.delete-image'
                    },

                    limits : {
                        title : 70,
                        price : 15,
                        description : 1000,
                        images : 5
                    },

                    event : {
                        input : {
                            onTitle : function (event) {

                                let $input = $(this);

                                let limit = module.components.form.limits.title;

                                let title = $input.val();

                                if (title.length > limit) {
                                    $input.val(title.substr(0, limit));
                                }
                            },
                            onPrice : function (event) {

                                let $input = $(this);

                                let limit = module.components.form.limits.price;

                                let price = $input.val().replace(/\D/g, '');

                                if (price.length > limit) {
                                    price = price.substr(0, limit);
                                }

                                $input.val(price);
                            },
                            onDescription : function (event) {

                                let $textarea = $(this);

                                let limit = module.components.form.limits.description;

                                let description = $textarea.val();

                                if (description.length > limit) {
                                    $textarea.val(description.substr(0, limit));
                                }
                            }
                        },
                        change : {
                            onFile : function (event) {

                                let limit = module.components.form.limits.images - $('.image-wrap ul > li').length;

                                let files = Object.values(this.files).filter(module.components.form.isImage).slice(0, limit);

                                let data = new FormData();

                                $.each(files, function (_, file) {
                                    data.append('images[]', file);
                                });

                                data.append('_csrf', $.cookie('_csrf'));

                                $.ajax({
                                           url : $(this).closest('.additional').data('upload-url'),
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

                                                           module.components.form.images.add(file);

                                                       });
                                                   }
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
                        },
                        click : {
                            onDeleteImage : function (event) {

                                let $item = $(this).closest('li');

                                $.ajax({
                                           url : $item.data('delete-url'),
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
                                                   $item.remove();
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
                        },
                        submit : {
                            onForm : function (event) {

                                event.preventDefault();

                                let $form = $(this);

                                let data = module.components.form.serialize(this);

                                module.components.form.dimmer.show();

                                $.ajax({
                                           url : $form.attr('action'),
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
                                                   module.components.form.message.show.success();
                                               }

                                               if (response.status === 'fail') {
                                                   module.components.form.message.show.error(response.errors);
                                               }

                                           },
                                           complete : function (jqXHR, textStatus) {

                                               grecaptcha.reset();

                                               module.components.form.dimmer.hide();
                                           }
                                       })
                                ;
                            }
                        },
                        custom : {
                            onSort : function (sort) {

                                let url = $('.image-wrap ul').data('sort-url');

                                let data = {
                                    sort : sort,
                                    _csrf : $.cookie('_csrf')
                                };

                                $.ajax({
                                           url : url,
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

                            let content = module.components.form.mock.image(file);

                            $('.image-wrap.mt20 .items > ul').append(content);
                        }
                    },

                    message : {
                        selector : {
                            placeholder : '.message-placeholder',
                            icon : '.dismiss-icon'
                        },

                        show : {
                            error : function (errors) {

                                module.components.form.message.remove();

                                let content = module.components.form.mock.message.error(errors);

                                $(module.components.form.message.selector.placeholder).html(content).find('.message').transition('fade');
                            },
                            success : function () {

                                let content = module.components.form.mock.message.success();

                                $(module.components.form.message.selector.placeholder).html(content).find('.message').transition('fade');
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

                    dimmer : {
                        selector : {
                            element : '.billboard__advert-edit-dimmer'
                        },
                        settings : {
                            closable : false,
                            on : false,
                            duration : 250
                        },
                        show : function () {
                            this.get().dimmer(this.settings).dimmer('show');

                        },
                        hide : function () {
                            this.get().dimmer(this.settings).dimmer('hide');
                        },
                        content : function (content) {
                            this.get().html(content);
                        },
                        get : function () {
                            return $(this.selector.element);
                        }
                    },

                    mock : {
                        message : {
                            error : function (errors) {

                                let list = this.list(errors);

                                let content = `<div class="ui error hidden message">
                                                   <div class="header">
                                                       При валидации формы были обнаружены ошибки:
                                                   </div>
                                                   <ul class="list">${list}</ul>
                                               </div>`;

                                return content;
                            },
                            success : function () {

                                let content = `<div class="ui success hidden message">
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
                        dimmer : {
                            success : function () {

                                let content = `<div class="content">
                                                   <h2 class="ui secondary icon header" style="color: black;">
                                                       <i class="green check circle icon"></i>
                                                       Сохранено
                                                    </h2>
                                               </div>`;

                                return content;
                            }
                        },
                        image : function (image) {

                            let content = `<li data-image-id="${image.id}" data-delete-url="${image.deleteUrl}">
                                               <img src="${image.url}" alt="">
                                               <i class="close delete-image"></i>
                                           </li>`;

                            return content;
                        }
                    },

                    serialize : function (form) {

                        let data = new FormData(form);

                        data.delete('file');

                        return data;
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
                                  'input' + eventnamespace,
                                  module.components.form.selector.form + ' ' + module.components.form.selector.title,
                                  module.components.form.event.input.onTitle
                              )

                              .on(
                                  'input' + eventnamespace,
                                  module.components.form.selector.form + ' ' + module.components.form.selector.price,
                                  module.components.form.event.input.onPrice
                              )

                              .on(
                                  'input' + eventnamespace,
                                  module.components.form.selector.form + ' ' + module.components.form.selector.description,
                                  module.components.form.event.input.onDescription
                              )

                              .on(
                                  'change' + eventnamespace,
                                  module.components.form.selector.form + ' ' + module.components.form.selector.file,
                                  module.components.form.event.change.onFile
                              )

                              .on(
                                  'click' + eventnamespace,
                                  module.components.form.selector.form + ' ' + module.components.form.selector.deleteImage,
                                  module.components.form.event.click.onDeleteImage
                              )

                              .on(
                                  'submit' + eventnamespace,
                                  module.components.form.selector.form,
                                  module.components.form.event.submit.onForm
                              )
                        ;
                    }
                }
            },

            initialize : function () {

                this.semantic.initialize();

                this.sortable.initialize();

                this.events.bind.all();
            },

            semantic : {
                initialize : function () {

                    this.elements.dropdown.category.initialize();

                    this.elements.dropdown.city.initialize();
                },
                elements : {
                    dropdown : {
                        settings : {
                            message : {
                                selectOnKeydown : false,
                                forceSelection : false,
                                noResults : 'Результатов не найдено.'
                            }
                        },
                        category : {
                            initialize : function () {
                                $('.ui.categories.dropdown').dropdown(module.semantic.elements.dropdown.settings);
                            }
                        },
                        city : {
                            initialize : function () {
                                $('.ui.city.dropdown').dropdown(module.semantic.elements.dropdown.settings);
                            }
                        }
                    }
                }
            },

            sortable : {
                settings : {
                    // axis : 'x',
                    items : '.image-wrap li',
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

                        let serialized = module.$wrapper.sortable('toArray', { attribute : 'data-image-id' });

                        module.components.form.event.custom.onSort(serialized);
                    }
                },
                initialize : function () {
                    module.$wrapper.sortable(this.settings).disableSelection();
                }
            }

        };

        module.initialize();

    });

}(jQuery, window, document));
