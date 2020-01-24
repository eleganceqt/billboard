(function ($, window, document) {

    'use strict';

    $(function () {


        // @todo ADD TITLE TO UI CHECKBOX in items-menu
        // @todo A UNIFIED METHOD FOR SEARCH AND FILTERING
        // @todo CHECK IF WE CAN MAKE SOMETHING WITH DROPDOWN SEARCH

        const billboardAdvertsAction = {

            $wrapper : $('#adverts-wrapper'),

            dom : {
                $partnersDropdown : $('.partners-dropdown'),
                $citiesDropdown : $('.cities-dropdown'),
                $categoriesDropdown : $('.categories-dropdown'),

                $modalPlaceholder : $('.modal-placeholder')
            },

            selector : {
                toggleChildren : '.toggle-children'
                // toggleChildren: '.toggle-children'
            },

            privates : {
                jqXHR : {
                    abort : function () {
                        // ...
                    }
                }
            },

            appBackendUrl : '/webasyst/billboard/',

            initialize : function () {

                this.initializeSemanticUI();

                this.addDirectEventListeners();

                this.addDelegatedEventListeners();
            },

            initializeSemanticUI : function () {

                this.initDropdownComponent();

                this.initializeCheckboxComponent();
            },

            initDropdownComponent : function () {

                this.initPartnersDropdown();

                this.initCitiesDropdown();

                this.initCategoriesDropdown();
            },

            initializeCheckboxComponent : function () {
                this.$wrapper.find('.ui.checkbox').checkbox({ enableEnterKey : false });
            },

            initPartnersDropdown : function () {

                this.dom.$partnersDropdown.dropdown({
                                                        clearable : true,
                                                        selectOnKeydown : false,
                                                        forceSelection : false,
                                                        useLabels : false,
                                                        showOnFocus : false,
                                                        allowTab : false,
                                                        fullTextSearch : true,
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
                                                        }
                                                    });

            },

            initCitiesDropdown : function () {

                this.dom.$citiesDropdown.dropdown({
                                                      clearable : true,
                                                      selectOnKeydown : false,
                                                      forceSelection : false,
                                                      useLabels : false,
                                                      showOnFocus : false,
                                                      allowTab : false,
                                                      fullTextSearch : true,
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
                                                      }
                                                  });

            },

            initCategoriesDropdown : function () {

                this.dom.$categoriesDropdown.dropdown({
                                                          clearable : true,
                                                          selectOnKeydown : false,
                                                          forceSelection : false,
                                                          useLabels : false,
                                                          showOnFocus : false,
                                                          allowTab : false,
                                                          fullTextSearch : true,
                                                          message : {
                                                              count : '{count} выбрано',
                                                              noResults : 'Результатов не найдено.'
                                                          },
                                                          onChange : function (value, text, $choice) {

                                                              console.log('__onChange__');

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
                                                          }
                                                      });

            },

            addDirectEventListeners : function () {
                $(this.selector.toggleChildren).on('click', $.proxy(this.onChildrenToggle, this));
                $('.class').on('click', function (event) {

                });
            },

            addDelegatedEventListeners : function () {

                this.$wrapper

                    .on('input', '.search-input', $.proxy(this.onSearch, this))

                    .on('click', '.toggle-filters', $.proxy(this.onFilterToggle, this))

                    .on('click', '.open-modal:not(.loading)', $.proxy(this.onModalOpen, this))
                ;

            },

            onSearch : function (event) {

                let that = this;

                let $target = $(event.target);


                // that.privates.jqXHR.abort();


                console.log(event);

            },

            onFilterToggle : function (event) {
                this.$wrapper.find('.filter-row').transition('fade down');
            },

            onChildrenToggle : function (event) {

                event.preventDefault();

                event.stopPropagation();

                let $this = $(event.target);

                // let parentId = $this.closest('.item').data('value');

                $this.toggleClass('left down');

                // $this.closest('.scrolling.menu').find(`.child-of-` + parentId).transition('fade down').toggleClass('hidden');
            },

            onModalOpen : function (event) {

                let that = this;

                let $button = $(event.currentTarget);

                $button.addClass('loading');

                $.ajax({
                           url : that.appBackendUrl + 'adverts/fetchModal/',
                           method : 'POST',
                           data : {},
                           async : true,
                           cache : false,
                           processData : true,
                           dataType : 'json',
                           // beforeSend : function (jqXHR, settings) {
                           //
                           // },
                           error : function (jqXHR, textStatus, errorThrown) {

                           },
                           success : function (response, textStatus, jqXHR) {

                               if (response.status === 'ok') {
                                   that.buildUpModal(response.data.modalContent);
                               }

                               if (response.status === 'fail') {

                               }

                           },
                           complete : function (jqXHR, textStatus) {
                               $button.removeClass('loading');
                           }
                       });

            },

            buildUpModal : function (content) {

                let that = this;

                // let $placeholder = that.$wrapper.find('.modal-placeholder');

                let $modal = that.$wrapper.find('.modal-placeholder').html(content).find('.ui.modal');

                that.prepareModal($modal);

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

                $modal.find('.ui.dropdown').dropdown();

                $modal.find('.city-dropdown').dropdown({
                                                           clearable : true,
                                                           selectOnKeydown : false,
                                                           forceSelection : false,
                                                           useLabels : false,
                                                           showOnFocus : false,
                                                           allowTab : false,
                                                           fullTextSearch : true,
                                                           message : {
                                                               count : '{count} выбрано',
                                                               noResults : 'Результатов не найдено.'
                                                           }
                                                       });

                $modal.find('.category-dropdown').dropdown({
                                                               clearable : true,
                                                               selectOnKeydown : false,
                                                               forceSelection : false,
                                                               useLabels : false,
                                                               showOnFocus : false,
                                                               allowTab : false,
                                                               fullTextSearch : true,
                                                               message : {
                                                                   count : '{count} выбрано',
                                                                   noResults : 'Результатов не найдено.'
                                                               }
                                                           });


            },

            sendSearchAjax : function () {

            }


        };

        billboardAdvertsAction.initialize();

    });

}(jQuery, window, document));
