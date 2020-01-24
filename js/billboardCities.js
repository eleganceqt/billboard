(function ($, window, document) {

    'use strict';


    $(function () {

        const billboardCitiesAction = {

            $wrapper : $('#cities-wrapper'),

            dom : {
                $table : $('#cities-table')
            },

            selector : {

                wrapper : {
                    searchInput : '.entity-search-input',
                    addCityBttn : '.add-city-bttn',
                    modalPlaceholder : '.modal-placeholder',
                    tableDimmer : '.table-dimmer'
                },

                table : {
                    sortableTh : 'thead th:not(.not-sortable)'
                },

                modal : {
                    element : '.city-modal',
                    countryDropdown : '.country-dropdown',
                    messageField : '.message-field',
                    saveBttn : '.save-bttn'
                },

                extra : {
                    notLoading : ':not(.loading)'
                }

            },

            event : {

                wrapper : {

                    onSearch : function (event) {

                        let that = this;

                        let $input = $(event.currentTarget);

                        if (that.privates.delayTimer !== null) {
                            clearTimeout(that.privates.delayTimer);
                        }

                        that.privates.delayTimer = setTimeout(function () {
                            that.$wrapper.trigger('cities_refine');
                        }, 400);
                    },

                    onSort : function (event) {

                        let that = this;

                        let $th = $(event.currentTarget);

                        $th.closest('tr').find('th').not($th).removeClass('sorted ascending descending');

                        $th.hasClass('sorted') ? $th.toggleClass('ascending descending') : $th.addClass('sorted ascending');

                        that.$wrapper.trigger('cities_refine');
                    },

                    onRefine : function (event) {

                        let that = this;

                        that.showTableDimmer();

                        let sort = that.obtainSort();

                        let data = {
                            query : $.trim($(that.selector.wrapper.searchInput).val()),
                            sort_column : sort.column,
                            sort_direction : sort.direction
                        };

                        $.ajax({
                                   url : that.fullUrl('cities/refine/'),
                                   data : that.sanitize(data),
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

                                       }

                                       if (response.status === 'fail') {

                                       }

                                   },
                                   complete : function (jqXHR, textStatus) {
                                       that.hideTableDimmer();
                                   }

                               });

                    },

                    onAdd : function (event) {

                        let that = this;

                        let $bttn = $(event.currentTarget);

                        that.setLoading($bttn);

                        $.ajax({
                                   url : that.fullUrl('cities/fetchModal/'),
                                   data : {
                                       id : 'new'
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
                                           that.bootModal(response.data.content);
                                       }

                                       if (response.status === 'fail') {

                                       }

                                   },
                                   complete : function (jqXHR, textStatus) {
                                       that.unsetLoading($bttn);
                                   }

                               });


                    }
                },

                modal : {
                    onSave : function (event) {
                        console.log(event);
                    }
                }
            },

            class : {
                loading : 'loading'
            },

            privates : {
                delayTimer : null,
                jqXHR : {
                    abort : function () {
                        // ...
                    }
                }
            },

            appBackendUrl : '/webasyst/billboard/',

            initialize : function () {

                this.initializeSemanticUI();

                // this.addDirectEventListeners();

                this.addDelegatedEventListeners();

                // this.addTableEventListeners();
            },

            initializeSemanticUI : function () {

            },

            addDirectEventListeners : function () {

            },

            addDelegatedEventListeners : function () {

                let that = this;

                that.$wrapper
                    .on('input', that.selector.wrapper.searchInput, $.proxy(that.event.wrapper.onSearch, that))
                    .on('click', that.selector.table.sortableTh, $.proxy(that.event.wrapper.onSort, that))
                    .on('click', that.selector.wrapper.addCityBttn + that.selector.extra.notLoading, $.proxy(that.event.wrapper.onAdd, that))

                    .on('cities_refine', $.proxy(that.event.wrapper.onRefine, that))
                ;

            },

            addTableEventListeners : function () {

                let that = this;

                let $table = that.dom.$table;

                $('#cities-table  thead > ')

            },

            addModalEventListeners : function () {

                let that = this;

                $(that.selector.modal.element)
                    .on('click', that.selector.modal.saveBttn + that.selector.extra.notLoading, $.proxy(that.onModalSave, that))
            },


            bootModal : function (content) {

                let that = this;

                let $modal = that.$wrapper.find(that.selector.wrapper.modalPlaceholder).html(content).find(that.selector.modal.element);

                that.confModal($modal);
            },

            confModal : function ($modal) {

                let that = this;

                $modal
                    .modal({
                               autofocus : false,
                               restoreFocus : false,
                               observeChanges : false,
                               keyboardShortcuts : false,
                               closable : false,
                               duration : 300,
                               onShow : function () {

                                   that.initializeModalComponents($modal);

                                   that.addModalEventListeners();
                               },
                               onHidden : function () {
                                   $modal.remove();
                               }
                           })
                    .modal('show')
                ;

            },

            initializeModalComponents : function ($modal) {

                let that = this;

                $modal.find(that.selector.modal.countryDropdown).dropdown({
                                                                              selectOnKeydown : false,
                                                                              forceSelection : false,
                                                                              showOnFocus : false,
                                                                              allowTab : false,
                                                                              fullTextSearch : true,
                                                                              message : {
                                                                                  count : '{count} выбрано',
                                                                                  noResults : 'Результатов не найдено.'
                                                                              }
                                                                          });
            },


            onModalSave : function (event) {

                console.log(event);
            },

            obtainSort : function () {

                let that = this;

                let sort = {
                    column : null,
                    direction : null
                };

                let $sorted = that.dom.$table.find('thead th.sorted');

                if ($sorted.length) {
                    sort.column    = $sorted.data('column');
                    sort.direction = $sorted.hasClass('ascending') ? 'asc' : 'desc';
                }

                return sort;
            },

            sanitize : function (params) {

                $.each(params, function (key, value) {

                    value = $.trim(value);

                    if (value === '') {
                        value = undefined;
                    }

                    params[key] = value;
                });

                return params;
            },

            fullUrl : function (path) {
                return this.appBackendUrl + path;
            },

            setLoading : function (jqObject) {
                jqObject.addClass(this.class.loading);
            },

            unsetLoading : function (jqObject) {
                jqObject.removeClass(this.class.loading);
            },

            showTableDimmer : function () {

                this.$wrapper.find(this.selector.wrapper.tableDimmer)
                    .dimmer({ closable : false, on : false })
                    .dimmer('show')
                ;
            },

            hideTableDimmer : function () {

                this.$wrapper.find(this.selector.wrapper.tableDimmer)
                    .dimmer({ closable : false, on : false })
                    .dimmer('hide')
                ;
            }

        };

        billboardCitiesAction.initialize();

    });

}(jQuery, window, document));
