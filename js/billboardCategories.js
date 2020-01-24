(function ($, window, document) {

    $(function () {

        const billboardCategoriesAction = {

            $wrapper : $('#categories-wrapper'),

            dom : {},

            selector : {
                wrapper : {
                    addCategoryItem : '.addCategoryItem'
                },

                extra : {
                    notLoading : ':not(.loading)'
                }
            },

            event : {

                click : {

                    onCategoryAdd : function (event) {

                        let that = this;

                        console.log(that);

                        let $item = $(event.currentTarget);

                        $item.addClass('loading').find('.icon').removeClass('plus circle').addClass('loading spinner');

                        $.ajax({
                                   url : that.fullUrl('categories/fetchModal/'),
                                   data : {
                                       parent_id : 0
                                   },
                                   method : 'POST',
                                   async : true,
                                   cache : false,
                                   processData : true,
                                   dataType : 'json',
                                   beforeSend : function (jqXHR, settings) {

                                   },
                                   error : function (jqXHR, textStatus, errorThrown) {

                                   },
                                   success : function (response, textStatus, jqXHR) {

                                       if (response.status === 'ok') {
                                           that.buildUpModal(response.data.content);
                                       }

                                       if (response.status === 'fail') {

                                       }

                                   },
                                   complete : function (jqXHR, textStatus) {
                                       $item.removeClass('loading').find('.icon').removeClass('loading spinner').addClass('plus circle');
                                   }

                               });


                        // console.log($item);

                    }
                }

            },

            appBackendUrl : '/webasyst/billboard/',

            initialize : function () {

                this.initializeSemanticUI();

                this.addEventListeners();
            },

            initializeSemanticUI : function () {

            },

            addEventListeners : function () {

                this.onDraggable();
                this.onDroppable();

                // $('.draggable-list > .item:not(.droppable)').draggable({
                //                                                            axis : 'y',
                //                                                            connectToSortable : '.sortable-list',
                //                                                            containment : 'parent',
                //                                                            cursor : 'move',
                //                                                            // helper : 'clone',
                //                                                            revert : 'invalid',
                //                                                            refreshPositions : true,
                //                                                            // snap : true
                //                                                        })
                //                                             .disableSelection();
                //
                // $('.draggable-list > .droppable').droppable();

                // this.onSortable();

                this.$wrapper
                    .on('click', this.selector.wrapper.addCategoryItem + this.selector.extra.notLoading, $.proxy(this.event.click.onCategoryAdd, this));

            },

            onSortable : function () {

                let that = this;

                let $sortableItem = $('.sortable-list');

                let componentSettings = {
                    axis : 'y',
                    items : '> .item:not(.droppable)',
                    tolerance : 'pointer',
                    revert : true,
                    containment : 'parent',
                    // handle : '.folder.icon',
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

                        let $list = $(ui.item).closest('.sortable-list');

                        let serialized = $list.sortable('serialize', {
                            key : 'sort[]',
                            attribute : 'data-file-id',
                            expression : /(.+)/
                        });

                        that.handleItemsSort(serialized);
                    }
                };

                $sortableItem.sortable(componentSettings).disableSelection();

            },

            onDraggable : function () {

                $('.draggable-list .item:not(.not-draggable)').draggable({
                                                         axis : 'y',
                                                         // containment : '.draggable-list',
                                                         refreshPositions : true,
                                                         revert : 'invalid',
                                                         revertDuration : 150,
                                                         handle : '.folder.icon',
                                                         // helper : 'clone',
                                                         // helper : function () {
                                                         //     var self   = $(this);
                                                         //     var parent = self.parents('.s-collection-list:first').find('ul:first');
                                                         //     var clone  = self.clone().addClass('ui-draggable dr-helper').css({
                                                         //                                                                          position : 'absolute'
                                                         //                                                                      }).prependTo(parent);
                                                         //     clone.find('a:first').append('<i class="icon10 no-bw" style="margin-left: 0; margin-right: 0; display:none;"></i>');
                                                         //     return clone;
                                                         // },
                                                         // cursor : 'move',
                                                         cursorAt : { left : 500 },
                                                         // delay : 100,
                                                         // opacity : 0.75
                                                         // zIndex : 9999,
                                                         distance : 3,
                                                         drag : function (event, ui) {

                                                             let $this = $(this);


                                                         },
                                                         start : function (event, ui) {

                                                             $('.item-droppable').css({ 'background-color' : 'rgba(0,0,0,.05)' });
                                                             // $('.item-droppable').css({ 'height' : '34px' });


                                                         },
                                                         stop : function () {

                                                             $('.item-droppable').css({ 'background-color' : 'transparent' });
                                                             // $('.item-droppable').css({ 'height' : '3px' });
                                                             // $('.item-droppable').css({ 'height' : '34px' });

                                                         }
                                                     });
            },

            onDroppable : function () {

                $('.draggable-list .item-droppable').droppable({
                                                                   greedy : true,
                                                                   tolerance : 'pointer',
                                                                   drop : function (event, ui) {

                                                                       console.log(
                                                                           $(this),
                                                                           ui.draggable
                                                                       );

                                                                       let $this = $(this);

                                                                       let $item = $(ui.draggable)
                                                                           .css({
                                                                                                           left : 'auto',
                                                                                                           right : 'auto',
                                                                                                           top : 'auto',
                                                                                                           bottom : 'auto'
                                                                                                       })
                                                                                                  .detach();

                                                                       $this.after($item);

                                                                       $this.css({ 'background' : 'transparent' });


                                                                       // $(this).append(ui.draggable);
                                                                   },
                                                                   out : function (event, ui) {

                                                                       let $this = $(this);

                                                                       $this.css({ 'background-color' : 'rgba(0,0,0,.06)' });
                                                                   },
                                                                   over : function (event, ui) {

                                                                       let $this = $(this);

                                                                       $this.css({ 'background' : 'rgba(33,186,69, 0.2)' });
                                                                   }
                                                               });


            },

            onDraggable2 : function () {

                var containment         = $('#wa-app .sidebar:first');
                var containment_pos     = containment.position();
                var containment_metrics = { width : containment.width(), height : containment.height() };

                $(".s-collection-list li.dr").liveDraggable({
                                                                // containment : [
                                                                //     containment_pos.left,
                                                                //     containment_pos.top,
                                                                //     containment_pos.left + containment_metrics.width * 1.25,
                                                                //     containment_pos.top + containment_metrics.height * 1.25
                                                                // ],
                                                                containment : 'parent',
                                                                refreshPositions : true,
                                                                revert : 'invalid',
                                                                helper : function () {
                                                                    var self   = $(this);
                                                                    var parent = self.parents('.s-collection-list:first').find('ul:first');
                                                                    var clone  = self.clone().addClass('ui-draggable dr-helper').css({
                                                                                                                                         position : 'absolute'
                                                                                                                                     }).prependTo(parent);
                                                                    clone.find('a:first').append('<i class="icon10 no-bw" style="margin-left: 0; margin-right: 0; display:none;"></i>');
                                                                    return clone;
                                                                },
                                                                cursor : 'move',
                                                                cursorAt : { left : 5 },
                                                                opacity : 0.75,
                                                                zIndex : 9999,
                                                                distance : 5,
                                                                start : function (event, ui) {
                                                                    document.ondragstart = function () {
                                                                        return false;
                                                                    };
                                                                },
                                                                stop : function () {
                                                                    document.ondragstart = null;
                                                                }
                                                            });
            },

            onDroppable2 : function () {
                this.initDropBetweenCollections();
                this.initDropInsideCollections();
            },

            initDropBetweenCollections : function () {
                $('.s-collection-list li.drag-newposition').liveDroppable({
                                                                              greedy : true,
                                                                              tolerance : 'pointer',
                                                                              over : function (event, ui) {
                                                                                  var self = $(this);
                                                                                  if (ui.draggable.attr('data-type') != self.attr('data-type')) {
                                                                                      return false;
                                                                                  }
                                                                                  self.addClass('active').parent().parent().addClass('drag-active');
                                                                              },
                                                                              out : function (event, ui) {
                                                                                  var self = $(this);
                                                                                  if (ui.draggable.attr('data-type') != self.attr('data-type')) {
                                                                                      return false;
                                                                                  }
                                                                                  self.removeClass('active').parent().parent().removeClass('drag-active');
                                                                              },
                                                                              deactivate : function (event, ui) {
                                                                                  var self = $(this);
                                                                                  if (ui.draggable.attr('data-type') != self.attr('data-type')) {
                                                                                      return false;
                                                                                  }
                                                                                  if (self.is(':animated') || self.hasClass('dragging')) {
                                                                                      self.stop().animate({ height : '2px' }, 300, null,
                                                                                                          function () {
                                                                                                              self.removeClass('dragging');
                                                                                                          }
                                                                                      );
                                                                                  }
                                                                                  self.removeClass('active').parent().parent().removeClass('drag-active');
                                                                              },
                                                                              drop : function (event, ui) {
                                                                                  var self = $(this);
                                                                                  var dr   = ui.draggable;
                                                                                  var type = dr.attr('data-type');
                                                                                  if (type != self.attr('data-type')) {
                                                                                      return false;
                                                                                  }

                                                                                  var getRawId = function (id) {
                                                                                      var parts = id.split('-');
                                                                                      parts.shift();
                                                                                      return parts.join('-');
                                                                                  };


                                                                                  var id   = getRawId(dr.attr('id'));
                                                                                  var prev = self.prev('li');
                                                                                  var sep  = dr.next();
                                                                                  var home = dr.prev();

                                                                                  if (prev.length && prev.attr('id') == 'category-' + id && ! prev.hasClass('dr-helper')) {
                                                                                      return false;
                                                                                  }
                                                                                  if (this == dr.next().get(0)) {
                                                                                      return false;
                                                                                  }

                                                                                  var parent_list   = dr.parent('ul');
                                                                                  var li_count      = parent_list.children('li.dr[id!=category-' + id + ']').length;
                                                                                  var old_parent_id = parseInt(getRawId(parent_list.parent().attr('id')), 10) || 0;

                                                                                  self.after(sep).after(dr);

                                                                                  var parent = dr.parent().parent();
                                                                                  if (parent.is('li.dr') || parent.is('.s-collection-list')) {
                                                                                      var parent_id = 0;
                                                                                      if (! parent.is('.s-collection-list')) {
                                                                                          parent_id = parseInt(getRawId(parent.attr('id')), 10) || 0;
                                                                                      }
                                                                                      var next      = dr.nextAll('li.dr:first');
                                                                                      var before_id = null;
                                                                                      if (next.length) {
                                                                                          before_id = getRawId(next.attr('id')) || null;
                                                                                      }

                                                                                      if (! li_count && old_parent_id !== parent_id) {
                                                                                          parent_list.parent('li').children('i').hide();
                                                                                          parent_list.hide();
                                                                                      }

                                                                                      // $.product_dragndrop.trigger('move_list', {
                                                                                      //     id : id,
                                                                                      //     type : type,
                                                                                      //     before_id : before_id,
                                                                                      //     parent_id : parent_id,
                                                                                      //     success : function (r) {
                                                                                      //         if (! li_count && old_parent_id !== parent_id) {
                                                                                      //             parent_list.parent('li').children('i').remove();
                                                                                      //             parent_list.remove();
                                                                                      //             $.categories_tree.setCollapsed(old_parent_id);
                                                                                      //         }
                                                                                      //     },
                                                                                      //     error : function (r) {
                                                                                      //         if (r && console) {
                                                                                      //             console.log(typeof r.errors !== 'undefined' ? r.errors : r);
                                                                                      //         }
                                                                                      //         // restore
                                                                                      //         home.after(dr.next()).after(dr);
                                                                                      //         if (! li_count) {
                                                                                      //             parent_list.parent('li').children('i').show();
                                                                                      //             parent_list.show();
                                                                                      //         }
                                                                                      //     }
                                                                                      // });
                                                                                  }
                                                                              }
                                                                          });
            },

            initDropInsideCollections : function () {
                $('.s-collection-list .item').liveDroppable({
                                                                tolerance : 'pointer',
                                                                greedy : true,
                                                                out : function (event, ui) {
                                                                    var dr   = ui.draggable;
                                                                    var self = $(this).parent();
                                                                    if (! dr.hasClass('product') && self.attr('data-type') != dr.attr('data-type')) {
                                                                        return false;
                                                                    }
                                                                    if (dr.hasClass('product')) {
                                                                        ui.helper.find('span').show().end().find('i').hide();       // show 'circle'-icon
                                                                    }
                                                                    self.removeClass('drag-newparent');
                                                                },
                                                                over : function (event, ui) {
                                                                    var dr   = ui.draggable;
                                                                    var self = $(this).parent();
                                                                    var type = dr.attr('data-type');
                                                                    if (! dr.hasClass('product') && type != self.attr('data-type')) {
                                                                        return false;
                                                                    }
                                                                    if (type != 'set') {
                                                                        self.addClass('drag-newparent');
                                                                    }
                                                                    if (dr.hasClass('product')) {
                                                                        if (self.hasClass('dynamic')) {
                                                                            ui.helper.find('span').hide().end().find('i').show();   // show 'cross'-icon
                                                                        } else {
                                                                            ui.helper.find('span').show().end().find('i').hide();   // show 'circle'-icon
                                                                        }
                                                                        return false;
                                                                    }

                                                                    if (! dr.hasClass('dynamic') && self.hasClass('dynamic')) {
                                                                        ui.helper.find('i.no-bw').show();
                                                                        return false;
                                                                    } else {
                                                                        ui.helper.find('i.no-bw').hide();
                                                                    }

                                                                    var drSelector = '.dr[id!="' + dr.attr('id') + '"]';
                                                                    var nearby     = $();

                                                                    // helper to widen all spaces below the current li and above next li (which may be on another tree level, but not inside current)
                                                                    var addBelow = function (nearby, current) {
                                                                        if (! current.length) {
                                                                            return nearby;
                                                                        }
                                                                        nearby = nearby.add(current.nextUntil(drSelector).filter('li.drag-newposition'));
                                                                        if (current.nextAll(drSelector).length > 0) {
                                                                            return nearby;
                                                                        }
                                                                        return addBelow(nearby, current.parent().closest('li'));
                                                                    };

                                                                    // widen all spaces above the current li and below the prev li (which may be on another tree level)
                                                                    var above = self.prevAll(drSelector + ':first');
                                                                    if (above.length > 0) {
                                                                        var d = above.find(drSelector);
                                                                        if (d.length > 0) {
                                                                            nearby = addBelow(nearby, d.last());
                                                                        } else {
                                                                            nearby = addBelow(nearby, above);
                                                                        }
                                                                    } else {
                                                                        nearby = nearby.add(self.prevUntil(drSelector).filter('li.drag-newposition'));
                                                                    }

                                                                    // widen all spaces below the current li and above the next li (which may be on another tree level)
                                                                    if (self.children('ul').children(drSelector).length > 0) {
                                                                        nearby = nearby.add(self.children('ul').children('li.drag-newposition:first'));
                                                                    } else {
                                                                        nearby = addBelow(nearby, self);
                                                                    }

                                                                    var old = $('.drag-newposition:animated, .drag-newposition.dragging').not(nearby);

                                                                    old.stop().animate({ height : '2px' }, 300, null, function () {
                                                                        old.removeClass('dragging');
                                                                    });
                                                                    nearby.stop().animate({ height : '10px' }, 300, null, function () {
                                                                        nearby.addClass('dragging');
                                                                    });
                                                                },
                                                                drop : function (event, ui) {
                                                                    var dr   = ui.draggable;
                                                                    var self = $(this).parent();
                                                                    var type = dr.attr('data-type');
                                                                    if (! dr.hasClass('product')) {
                                                                        if (type == 'set') {
                                                                            return false;
                                                                        }
                                                                        if (self.attr('id') == dr.attr('id')) {
                                                                            return false;
                                                                        }
                                                                        if (type != self.attr('data-type')) {
                                                                            return false;
                                                                        }
                                                                    }
                                                                    self.removeClass('drag-newparent');

                                                                    // coping product to category section
                                                                    if (dr.hasClass('product')) {
                                                                        if (self.hasClass('dynamic')) {
                                                                            return false;
                                                                        }
                                                                        var product_list = $('#product-list');

                                                                        var data = {};
                                                                        if (product_list.find('.s-select-all').is(':checked')) {
                                                                            data.whole_list = true;
                                                                        } else {
                                                                            var products     = product_list.find('.product.selected');
                                                                            data.product_ids = products.map(function () {
                                                                                return $(this).attr('data-product-id');
                                                                            }).toArray();
                                                                        }

                                                                        $.product_dragndrop.trigger('add_to_list', $.extend(data, {
                                                                            collection_param : self.attr('id').replace('-', '_id='),
                                                                            success : function (r) {
                                                                                if (data.whole_list) {
                                                                                    product_list.find('.s-select-all').trigger('select', false);
                                                                                } else if (data.product_ids && data.product_ids.length) {
                                                                                    products.trigger('select', false);
                                                                                }
                                                                                if (r.data) {
                                                                                    self.find('>.counters .count:not(.subtree)').text(r.data.count);
                                                                                    self.find('>.counters .subtree').text(r.data.total_count);
                                                                                }
                                                                            }
                                                                        }));
                                                                        return false;
                                                                    } else {
                                                                        if (! dr.hasClass('dynamic') && self.hasClass('dynamic')) {
                                                                            return false;
                                                                        }
                                                                    }

                                                                    // sorting categories
                                                                    var id = dr.attr('id').split('-')[1];
                                                                    if (self.attr('id') == 'category-' + id) {
                                                                        return false;
                                                                    }

                                                                    if (dr.hasClass('product')) {
                                                                        var selected = $('#product-list').find('.product.selected');
                                                                        selected.trigger('select', false);
                                                                        return false;
                                                                    }

                                                                    var parent_id = parseInt(self.attr('id').split('-')[1], 10) || 0;

                                                                    var list = null;
                                                                    var sep  = dr.next();
                                                                    var home = dr.prev();

                                                                    // for tracking situation when list acceptor has no children
                                                                    // and inserted item will be first
                                                                    var first_child = false;

                                                                    if (self.hasClass('drag-newposition')) {
                                                                        list = self.parent('ul');
                                                                    } else {
                                                                        // has loaded (via ajax) children items
                                                                        if (self.children('ul').length) {
                                                                            list = self.children('ul');
                                                                        } else if (! self.find('>i.collapse-handler-ajax').length) { // no children

                                                                            list = $(
                                                                                '<ul class="menu-v with-icons dr unapproved">' +
                                                                                '<li class="drag-newposition unapproved" data-type="' + type + '"></li>' +
                                                                                '</ul>'
                                                                            ).appendTo(self);
                                                                            list.find('.drag-newposition').mouseover(); // init droppable
                                                                            $('<i class="icon16 darr overhanging collapse-handler-ajax unapproved" id="' +
                                                                              type + '-' + parent_id + '-handler' +
                                                                              '"></i>').insertBefore(self.children('a'));

                                                                            first_child = true;
                                                                        }
                                                                    }

                                                                    var parent_list   = dr.parent('ul');
                                                                    var li_count      = parent_list.children('li.dr[id!=category-' + id + ']').length;
                                                                    var old_parent_id = parseInt(parent_list.parent().attr('id').split('-')[1], 10) || 0;

                                                                    if (list) {
                                                                        list.append(dr).append(sep);
                                                                    }

                                                                    if (! li_count && old_parent_id !== parent_id) {
                                                                        parent_list.parent('li').children('i').hide();
                                                                        parent_list.hide();
                                                                    }

                                                                    var parent = self;
                                                                    if (parent.is('li.dr')) {
                                                                        $.product_dragndrop.trigger('move_list', {
                                                                            id : id,
                                                                            type : type,
                                                                            parent_id : parent_id,
                                                                            success : function (r) {
                                                                                if (! li_count && old_parent_id !== parent_id) {
                                                                                    parent_list.parent('li').children('i').remove();
                                                                                    parent_list.remove();
                                                                                    $.categories_tree.setCollapsed(old_parent_id);
                                                                                }
                                                                                // has children, but not loaded yet
                                                                                if (! list) {
                                                                                    dr.remove();
                                                                                    sep.remove();
                                                                                    // Because children is not loaded yet, calling of count_subtree (see below)
                                                                                    // will not have effect.
                                                                                    // So counters is returned by server
                                                                                    self.trigger('update_counters',
                                                                                                 r.data.count || {}
                                                                                    );
                                                                                } else {
                                                                                    $('.s-collection-list .unapproved').removeClass('unapproved');
                                                                                    if (first_child) {
                                                                                        $.categories_tree.setExpanded(parent_id);
                                                                                    } else {
                                                                                        self.trigger('count_subtree');
                                                                                    }
                                                                                }
                                                                            },
                                                                            error : function (r) {
                                                                                if (r && console) {
                                                                                    console.log(typeof r.errors !== 'undefined' ? r.errors : r);
                                                                                }
                                                                                // restore
                                                                                home.after(dr).after(sep);
                                                                                if (! li_count) {
                                                                                    parent_list.parent('li').children('i').show();
                                                                                    parent_list.show();
                                                                                }
                                                                                $('.s-collection-list .unapproved').remove();
                                                                            }
                                                                        });
                                                                    }
                                                                }
                                                            });
            },

            handleItemsSort : function (data) {

                let that = this;

                $.ajax({
                           url : '#',
                           method : 'POST',
                           data : data,
                           async : true,
                           cache : false,
                           dataType : 'json',
                           error : function (jqXHR, textStatus, errorThrown) {
                               // alert('Внутренняя ошибка сервера.');
                           },
                           success : function (jsonResponse, textStatus, jqXHR) {

                               if (jsonResponse.status === 'ok') {
                                   // ...
                               }

                               if (jsonResponse.status === 'fail') {
                                   // that.alertErrors(jsonResponse.errors);
                               }

                           },
                           complete : function (jqXHR, textStatus) {
                               // ...
                           }

                       });

            },

            buildUpModal : function (content) {

                let that = this;

                let $modal = that.$wrapper.find('.modal-placeholder').html(content).find('.ui.modal');

                // that.prepareModal($modal);

                $modal.modal({
                                 autofocus : false,
                                 centered : true,
                                 restoreFocus : false,
                                 observeChanges : false,
                                 keyboardShortcuts : false,
                                 closable : false,
                                 // transition: 'fade',
                                 duration : 350,
                                 onHidden : function () {
                                     $modal.remove();
                                 }
                             })
                      .modal('show');

            },

            prepareModal : function ($modal) {

                // $modal.find('.ui.dropdown').dropdown();
                //
                // $modal.find('.city-dropdown').dropdown({
                //                                            clearable : true,
                //                                            selectOnKeydown : false,
                //                                            forceSelection : false,
                //                                            useLabels : false,
                //                                            showOnFocus : false,
                //                                            allowTab : false,
                //                                            fullTextSearch : true,
                //                                            message : {
                //                                                count : '{count} выбрано',
                //                                                noResults : 'Результатов не найдено.'
                //                                            }
                //                                        });
                //
                // $modal.find('.category-dropdown').dropdown({
                //                                                clearable : true,
                //                                                selectOnKeydown : false,
                //                                                forceSelection : false,
                //                                                useLabels : false,
                //                                                showOnFocus : false,
                //                                                allowTab : false,
                //                                                fullTextSearch : true,
                //                                                message : {
                //                                                    count : '{count} выбрано',
                //                                                    noResults : 'Результатов не найдено.'
                //                                                }
                //                                            });


            },

            fullUrl : function (path) {
                return this.appBackendUrl + path;
            }
        };

        billboardCategoriesAction.initialize();

    });

}(jQuery, window, document));
