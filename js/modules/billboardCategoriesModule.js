(function ($, window, document) {

    'use strict';

    $(function () {

        const module = {

            $wrapper : $('#billboardCategories__wrapper'),

            skeleton : {

                attributes : {
                    namespace : {
                        module : 'billboardCategories'
                    },
                    selector : {
                        notLoading : ':not(.loading)'
                    },
                    className : {
                        loading : 'loading'
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
                        hasChildren : function () {

                        }
                    },

                    unset : {
                        loading : function ($element) {
                            $element.removeClass(module.skeleton.attributes.className.loading);
                        }
                    },

                    unless : {
                        abort : function (textStatus, callback) {
                            if (textStatus !== 'abort') {
                                callback();
                            }
                        },
                        new : function (id, callback) {
                            if (id === 'new') {
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

                list : {

                    selector : {
                        element : '.billboardCategories--draggable-list',
                        buttons : {
                            create : '.billboardCategories--create-category-item',
                            subcreate : '.billboardCategories--subcreate-category-bttn',
                            edit : '.billboardCategories--edit-category-bttn',
                            delete : '.billboardCategories--delete-category-bttn'
                        },
                        item : {
                            draggable : '.billboardCategories--draggable-list .item.draggable',
                            droppable : '.billboardCategories--draggable-list .item.droppable',
                            dynamic : '.billboardCategories--draggable-list .item.droppable.dynamic'
                        },
                        toggler : '.toggler'
                    },

                    route : {
                        create : 'categories/create/',
                        edit : 'categories/edit/',
                        delete : 'categories/delete/',
                        move : 'categories/move/'
                    },

                    event : {
                        click : {
                            onCreate : function (event) {

                                console.warn('onCreate(e) invoked.', { event });

                                let $button = $(event.currentTarget);

                                //@todo THINK HERE
                                // module.skeleton.methods.set.loading($button);

                                $button.addClass('loading').find('.icon').removeClass('plus circle').addClass('loading spinner');


                                $.ajax({
                                           url : module.skeleton.methods.routeUrl(module.components.list.route.create),
                                           data : { id : 'new', parent_id : $button.data('parent-id') },
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
                                               $button.removeClass('loading').find('.icon').removeClass('loading spinner').addClass('plus circle');
                                           }
                                       })
                                ;
                            },

                            onEdit : function (event) {

                                console.warn('onEdit(e) invoked.', { event });

                                let $button = $(event.currentTarget);

                                module.skeleton.methods.set.loading($button);

                                $.ajax({
                                           url : module.skeleton.methods.routeUrl(module.components.list.route.edit),
                                           data : { id : $button.closest('.draggable').data('category-id') },
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
                            },

                            onDelete : function (event) {

                                console.warn('onDelete(e) invoked.', { event });

                                let $button = $(event.currentTarget);

                                module.skeleton.methods.set.loading($button);

                                let data = {
                                    id : $button.closest('.draggable').data('category-id')
                                };

                                $.ajax({
                                           url : module.skeleton.methods.routeUrl(module.components.list.route.delete),
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
                                                   module.components.list.delete(data.id);
                                                   // module.components.modal.boot(response.data.content);
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
                            },

                            onToggle : function (event) {

                                console.warn('onToggle(e) invoked.', { event });

                                let $icon = $(event.currentTarget);

                                $icon.toggleClass('right down');

                                $icon.closest('.item')
                                     .find('div.list:first')
                                     .transition({ animation : 'fade', duration : 250 });
                            }
                        },
                        custom : {
                            onDraggable : function (dynamic) {

                                let selector = module.components.list.selector.element + module.components.list.selector.item.draggable + (dynamic ? ':not(.ui-draggable)' : '');

                                $(selector)
                                    .draggable({
                                                   // axis : 'y',
                                                   // containment : module.components.list.selector.element,
                                                   handle : '.folder.icon',
                                                   refreshPositions : true,
                                                   revert : 'invalid',
                                                   revertDuration : 250,
                                                   scope : 'billboardCategories',
                                                   start : function (event, ui) {
                                                       $(module.components.list.selector.item.droppable + ':not(.draggable)').css({ 'background-color' : 'rgba(0,0,0,.1)' });
                                                   },
                                                   stop : function (event, ui) {
                                                       $(module.components.list.selector.item.droppable).css({ 'background-color' : 'transparent' });
                                                   }
                                               });

                            },
                            onDroppable : function (dynamic = false) {

                                let selector = module.components.list.selector.element + module.components.list.selector.item.droppable + (dynamic ? ':not(.ui-droppable)' : '');

                                $(selector)
                                    .droppable({
                                                   accept : module.components.list.selector.item.draggable,
                                                   greedy : true,
                                                   scope : 'billboardCategories',
                                                   tolerance : 'pointer',
                                                   drop : function (event, ui) {

                                                       let $droppable = $(this);

                                                       let $draggable = $(ui.draggable);

                                                       module.components.list.drop($draggable, $droppable);

                                                       module.components.list.rebind.droppable();
                                                   },
                                                   out : function (event, ui) {

                                                       let $this = $(this);

                                                       if ($this.hasClass('draggable')) {

                                                       } else {
                                                           $this.css({ 'background-color' : 'rgba(0,0,0,.06)' });
                                                       }
                                                   },
                                                   over : function (event, ui) {

                                                       let $this = $(this);

                                                       $('.item.draggable.droppable').css({ 'background-color' : 'transparent' });

                                                       if ($this.hasClass('draggable')) {

                                                           $this.css({ 'background-color' : 'rgba(0,0,0,.06)' }); // grey

                                                       } else {
                                                           $this.css({ 'background' : 'rgba(33,186,69, 0.3)' }); // green
                                                       }
                                                   }
                                               });
                            }
                        }
                    },

                    add : function (category) {

                        let $rootList = this.get();

                        let draggable = module.components.list.mock.item(category);

                        let droppable = module.components.list.mock.droppable();

                        if (category.parent_id === null) {

                            let items = [];

                            let hasDraggables = ($rootList.children('.draggable').length > 0);

                            if (! hasDraggables) {
                                items.push(droppable);
                            }

                            items.push(draggable, droppable);

                            $rootList.find('.ui.divider').before(items);

                        } else {

                            let $parent = $rootList.find('.item[data-category-id="' + category.parent_id + '"]');

                            let hasChildren = ($parent.find('.draggable').length > 0);

                            if (hasChildren) {

                                $parent.find('.list:first').append([draggable, droppable]);

                            } else {

                                let $list = $(module.components.list.mock.list());

                                $list.append([droppable, draggable, droppable]);

                                $parent.find('a.header:first').after($list);

                                module.components.list.set.collapsible($parent);
                            }
                        }

                        this.rebind.draggable();

                        this.rebind.droppable();
                    },

                    update : function (category) {

                        let $category = this.get().find('.draggable[data-category-id="' + category.id + '"]');

                        let color = (category.status === 'on' ? 'black' : 'grey');

                        $category.find('.folder.icon').removeClass('black grey').addClass(color);

                        $category.find('a.header:first').html(category.name);
                    },

                    delete : function (categoryId) {

                        let $category = this.get().find('.draggable[data-category-id="' + categoryId + '"]');

                        let $list = $category.closest('.list');

                        $category.next('.droppable').remove();

                        $category.remove();

                        if (this.notRootList($list)) {

                            let hasDraggables = ($list.children('.draggable').length > 0);

                            if (! hasDraggables) {

                                module.components.list.unset.collapsible($list.closest('.draggable'));

                                $list.remove();
                            }
                        }
                    },

                    draggable : {
                        css : {
                            left : 'auto',
                            right : 'auto',
                            top : 'auto',
                            bottom : 'auto'
                        },
                        detach : function ($draggable) {

                            $draggable.next('.droppable:not(.draggable)').remove();

                            $draggable.css(this.css).detach();
                        }
                    },

                    drop : function ($draggable, $droppable) {

                        let droppableMock = module.components.list.mock.droppable();

                        let $sourceList = $draggable.closest('.list');

                        let $targetList = $droppable.find('.list:first');

                        // console.log({ $draggable, $droppable, $sourceList, $targetList });

                        let droppedOnDraggable = $droppable.hasClass('draggable');

                        if (droppedOnDraggable) {

                            let hasChildren = ($targetList.children('.draggable').length > 0);

                            if (hasChildren) {

                                // console.log('hasCildren');

                                $draggable.css(module.components.list.draggable.css);

                                if (this.notSameList($sourceList, $targetList)) {

                                    this.draggable.detach($draggable);

                                    $targetList.append([$draggable, droppableMock]);
                                }

                            } else {

                                // console.log('noChildren');

                                let $list = $(module.components.list.mock.list());

                                this.draggable.detach($draggable);

                                module.components.list.set.collapsible($droppable);

                                $list.append([droppableMock, $draggable, droppableMock]);

                                $droppable.find('a.header:first').after($list);
                            }

                            module.components.list.clean($sourceList);

                        } else {

                            $draggable.css(module.components.list.draggable.css);

                            // no reason to drop on siblings
                            if (this.notSibling($draggable, $droppable)) {

                                this.draggable.detach($draggable);

                                $droppable.after([$draggable, droppableMock]);

                                module.components.list.clean($sourceList);
                            }
                        }

                        let data = {
                            id : $draggable.data('category-id'),
                            parent_id : $draggable.closest('.list').closest('.draggable').data('category-id'),
                            before_id : $draggable.next().next().data('category-id')
                        };

                        $.ajax({
                                   url : module.skeleton.methods.routeUrl(module.components.list.route.move),
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

                                           // module.components.modal.message.show.success();

                                           // module.skeleton.methods.unless.new(data.id, function () {
                                           //
                                           //     module.components.list.add(response.data.category);
                                           //
                                           //     $button.remove();
                                           // });
                                       }

                                       if (response.status === 'fail') {
                                           // module.components.modal.message.show.error(response.errors);
                                       }

                                   },
                                   complete : function (jqXHR, textStatus) {
                                       // module.skeleton.methods.unset.loading($button);
                                   }

                               });


                        // console.log($draggable);
                        // data.id = $draggable.data('category-id');
                        // data.parent_id = $draggable.closest('.list').closest('.draggable').data('category-id');
                        // data.before_id = $draggable.next().next().data('category-id');

                        // console.log(data);
                    },

                    clean : function ($sourceList) {

                        if (this.notRootList($sourceList)) {

                            let hasDraggables = ($sourceList.children('.draggable').length > 0);

                            if (! hasDraggables) {

                                module.components.list.unset.collapsible($sourceList.closest('.draggable'));

                                $sourceList.remove();
                            }
                        }
                    },

                    notSibling : function ($draggable, $droppable) {

                        let prev = $draggable.prev('.droppable:not(.draggable)').get(0);
                        let next = $draggable.next('.droppable:not(.draggable)').get(0);

                        let droppable = $droppable.get(0);

                        return (prev !== droppable && next !== droppable);
                    },

                    notSameList : function ($firstList, $secondList) {
                        return $firstList.get(0) !== $secondList.get(0);
                    },

                    notRootList : function ($list) {
                        return $list.get(0) !== $(module.components.list.selector.element).get(0);
                    },

                    get : function () {
                        return $(this.selector.element);
                    },

                    rebind : {
                        draggable : function () {
                            module.components.list.event.custom.onDraggable(true);
                        },
                        droppable : function () {
                            module.components.list.event.custom.onDroppable(true);

                        }
                    },

                    mock : {
                        item : function (category) {

                            let color = category.status === 'on' ? 'black' : 'grey';

                            let content = `<div class="item draggable droppable" data-category-id="${category.id}">
                                               <i class="icon toggler"></i>
                                               <i class="large ${color} folder movable icon"></i>
                                               <div class="middle aligned content">
                                                   <div class="right floated middle aligned content">
                                                       <div class="ui tiny basic label">
                                                           0 / 0
                                                       </div>
                                                       <div class="ui tertiary tiny icon bttn billboardCategories--subcreate-category-bttn" data-parent-id="${category.id}">
                                                           <i class="plus circle icon"></i>
                                                       </div>
                                                       <div class="ui tertiary tiny icon bttn billboardCategories--edit-category-bttn">
                                                           <i class="pencil alternate icon"></i>
                                                       </div>
                                                       <div class="ui tertiary tiny icon bttn billboardCategories--delete-category-bttn">
                                                           <i class="trash alternate icon"></i>
                                                       </div>
                                                   </div>
                                                   <a class="header">${category.name}</a>
                                               </div>
                                           </div>`
                            ;

                            return content;
                        },
                        list : function () {

                            let content = `<div class="list"></div>`;

                            return content;
                        },
                        droppable : function () {

                            let content = `<div class="item droppable"></div>`;

                            return content;
                        }
                    },

                    set : {
                        collapsible : function ($element) {
                            $element.children('.toggler').addClass('angle down link');
                        }
                    },

                    unset : {
                        collapsible : function ($element) {
                            $element.children('.toggler').removeClass('angle right down link');
                        }
                    }
                },

                modal : {

                    selector : {
                        element : '.billboardCategories__modal',
                        execute : '.execute-operation',
                        save : '.billboardCategories__modal--save-button'
                    },

                    route : {
                        store : 'categories/store/',
                        update : 'categories/update/'
                    },

                    event : {
                        click : {
                            onOperationExecute : function (event) {

                                let $button = $(this);

                                module.skeleton.methods.set.loading($button);

                                let data = {
                                    id : module.components.modal.serialize.id()
                                };

                                let route = module.components.modal.serialize.operation();

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

                                               }

                                               if (response.status === 'fail') {
                                                   module.components.modal.message.show.error(response.errors);
                                               }

                                           },
                                           complete : function (jqXHR, textStatus) {
                                               module.skeleton.methods.unset.loading($button);
                                           }

                                       });

                            },

                            onSave : function (event) {

                                let $button = $(event.currentTarget);

                                module.skeleton.methods.set.loading($button);
                                module.components.modal.message.remove();

                                let data = {
                                    id : module.components.modal.serialize.id(),
                                    parent_id : module.components.modal.serialize.parentId(),
                                    name : module.components.modal.serialize.name(),
                                    description : module.components.modal.serialize.description(),
                                    slug : module.components.modal.serialize.slug(),
                                    title : module.components.modal.serialize.title(),
                                    meta_keywords : module.components.modal.serialize.meta.keywords(),
                                    meta_description : module.components.modal.serialize.meta.description(),
                                    status : module.components.modal.serialize.status()
                                };

                                let action = data.id === 'new' ? 'store' : 'update';

                                $.ajax({
                                           url : module.skeleton.methods.routeUrl(module.components.modal.route[action]),
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

                                                   if (action === 'store') {

                                                       module.components.list.add(response.data.category);

                                                       $button.remove();
                                                   }

                                                   if (action === 'update') {
                                                       module.components.list.update(response.data.category);
                                                   }

                                               }

                                               if (response.status === 'fail') {
                                                   module.components.modal.message.show.error(response.errors);
                                               }

                                           },
                                           complete : function (jqXHR, textStatus) {

                                               let $content = $button.closest('.modal').find('.content');
                                               let $message = $('.billboardCategories__modal--message-field');

                                               $content.animate({
                                                                    scrollTop : $message.offset().top - $content.offset().top + $content.scrollTop()
                                                                });

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
                                        module.components.modal.selector.execute + module.skeleton.attributes.selector.notLoading,
                                        module.components.modal.event.click.onOperationExecute
                                    )

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
                                statusDropdown : '.billboardCategories__modal--status-dropdown',
                                operationsDropdown : '.ui.operations.dropdown'

                            },
                            settings : {
                                selectOnKeydown : false,
                                forceSelection : false,
                                showOnFocus : false,
                                allowTab : false,
                                fullTextSearch : true
                            },
                            init : function () {

                                let settings = this.settings;

                                let $modal = module.components.modal.get();

                                $modal.find(this.selector.statusDropdown).dropdown(settings);

                                settings = $.extend(true, {}, settings, {
                                    onChange : function (value, text, $choice) {
                                        $modal.find('.execute-operation').removeClass('disabled');
                                    }
                                });

                                $modal.find(this.selector.operationsDropdown).dropdown(settings);
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
                            element : '.billboardCategories__modal-placeholder'
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
                            placeholder : '.billboardCategories__modal--message-field',
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
                        parentId : function () {

                            let parentId = $.trim($(module.components.modal.selector.element).find('input[name="parent_id"]').val());

                            return (parentId !== '') ? parentId : undefined;
                        },
                        name : function () {
                            return $.trim($(module.components.modal.selector.element).find('input[name="name"]').val());
                        },
                        description : function () {
                            return $.trim($(module.components.modal.selector.element).find('textarea[name="description"]').val());
                        },
                        slug : function () {
                            return $.trim($(module.components.modal.selector.element).find('input[name="slug"]').val());

                        },
                        title : function () {
                            return $.trim($(module.components.modal.selector.element).find('input[name="title"]').val());
                        },

                        meta : {
                            keywords : function () {
                                return $.trim($(module.components.modal.selector.element).find('textarea[name="meta_keywords"]').val());
                            },
                            description : function () {
                                return $.trim($(module.components.modal.selector.element).find('textarea[name="meta_description"]').val());
                            }
                        },
                        status : function () {
                            return $.trim($(module.components.modal.selector.element).find(module.components.modal.elements.dropdown.selector.statusDropdown).dropdown('get value'));
                        },
                        operation : function () {
                            return $.trim($(module.components.modal.selector.element).find(module.components.modal.elements.dropdown.selector.operationsDropdown).dropdown('get value'));
                        }
                    }
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

                        let eventnamespace = module.skeleton.computed.namespace.event();

                        module.$wrapper.on();

                    },
                    delegated : function () {

                        let eventnamespace = module.skeleton.computed.namespace.event();

                        module.$wrapper

                              .on(
                                  'click' + eventnamespace,

                                  [
                                      module.components.list.selector.buttons.create + module.skeleton.attributes.selector.notLoading,
                                      module.components.list.selector.buttons.subcreate + module.skeleton.attributes.selector.notLoading
                                  ].join(', '),
                                  module.components.list.event.click.onCreate
                              )

                              .on(
                                  'click' + eventnamespace,
                                  module.components.list.selector.buttons.edit,
                                  module.components.list.event.click.onEdit
                              )

                              .on(
                                  'click' + eventnamespace,
                                  module.components.list.selector.buttons.delete,
                                  module.components.list.event.click.onDelete
                              )

                              .on(
                                  'click' + eventnamespace,
                                  module.components.list.selector.toggler,
                                  module.components.list.event.click.onToggle
                              )

                        ;
                    },
                    custom : function () {
                        module.components.list.event.custom.onDraggable();
                        module.components.list.event.custom.onDroppable();
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
