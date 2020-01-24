(function ($, window, document) {

    $(function () {

        const billboardPartnersAction = {

            dom : {
                $wrapper : $('#')
            },

            initialize : function () {

                // $('.ui.')
                console.log('__billboardPartners.js__ initialized');

                this.initializeSemanticUI();

            },

            initializeSemanticUI : function () {
                $('.ui.cities-dropdown').dropdown({
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

            addEventListeners : function () {

            }
        };

        billboardPartnersAction.initialize();

    });

}(jQuery, window, document));
