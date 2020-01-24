(function ($, window, document) {

    'use strict';

    $(function () {

        const module = {

            $wrapper : $('.billboardSearch__wrapper'),

            skeleton : {

                attributes : {
                    namespace : {
                        module : 'billboardFrontendSearch'
                    },
                    selector : {
                        notLoading : ':not(.loading)',
                        notActive : ':not(.active)'
                    },
                    className : {
                        loading : 'loading'
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
                    }
                }
            },

            components : {

                search : {

                    input : {
                        selector : {
                            form : '.billboardSearch--input-form',
                            input : 'input[name="query"]'
                        },

                        event : {
                            submit : {
                                onForm : function (event) {

                                    event.preventDefault();

                                    module.$wrapper.trigger('searchRefine');
                                }
                            }
                        }
                    },

                    filters : {

                        selector : {
                            form : '.billboardSearch--filters-form',
                            categoriesDropdown : '.ui.categories.dropdown',
                            citiesDropdown : '.ui.cities.dropdown',
                            priceFrom : '.price-from',
                            priceTo : '.price-to',
                            priceInput : '.price_input'
                        },

                        event : {
                            input : {
                                onPrice : function (event) {

                                    let $input = $(this);

                                    let price = $input.val().replace(/\D/g, '');

                                    $input.val(price);
                                }
                            },
                            submit : {
                                onForm : function (event) {

                                    event.preventDefault();

                                    module.$wrapper.trigger('searchRefine');
                                }
                            }
                        }
                    },

                    event : {
                        custom : {
                            onSearchRefine : function (event) {
                                window.location.href = module.components.search.buildRedirectUrl();
                            }
                        }
                    },

                    buildRedirectUrl : function () {

                        let urlParams = this.buildUrlParams();

                        return module.$wrapper.data('search-url') + (urlParams ? '?' + urlParams : '');
                    },

                    buildUrlParams : function () {

                        let data = {
                            query : module.components.search.serialize.query(),
                            category_id : module.components.search.serialize.categoryId(),
                            city_id : module.components.search.serialize.cityId(),
                            price_from : module.components.search.serialize.price.from(),
                            price_to : module.components.search.serialize.price.to()
                        };

                        return $.param(module.components.search.sanitize(data));
                    },

                    serialize : {
                        query : function () {
                            return $.trim($(module.components.search.input.selector.form).find(module.components.search.input.selector.input).val());
                        },
                        categoryId : function () {
                            return $.trim($(module.components.search.filters.selector.categoriesDropdown).dropdown('get value'));
                        },
                        cityId : function () {
                            return $.trim($(module.components.search.filters.selector.citiesDropdown).dropdown('get value'));
                        },
                        price : {
                            from : function () {
                                return $.trim($(module.components.search.filters.selector.form).find(module.components.search.filters.selector.priceFrom).val());
                            },
                            to : function () {
                                return $.trim($(module.components.search.filters.selector.form).find(module.components.search.filters.selector.priceTo).val());
                            }
                        }
                    },

                    sanitize : function (params) {

                        let sanitized = {};

                        $.each(params, function (key, value) {

                            if ($.trim(value) !== '') {
                                sanitized[key] = value;
                            }
                        });

                        return sanitized;
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
                                  'searchRefine' + eventnamespace,
                                  module.components.search.event.custom.onSearchRefine
                              )
                        ;

                    },
                    delegated : function () {

                        let eventnamespace = module.skeleton.computed.namespace.event();

                        module.$wrapper

                              .on(
                                  'submit' + eventnamespace,
                                  module.components.search.input.selector.form,
                                  module.components.search.input.event.submit.onForm
                              )

                              .on(
                                  'input' + eventnamespace,
                                  module.components.search.filters.selector.priceInput,
                                  module.components.search.filters.event.input.onPrice
                              )

                              .on(
                                  'submit' + eventnamespace,
                                  module.components.search.filters.selector.form,
                                  module.components.search.filters.event.submit.onForm
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
                            match : 'text',
                            selectOnKeydown : false,
                            forceSelection : false,
                            message : {
                                noResults : 'Результатов не найдено.'
                            }
                        },
                        initialize : function () {
                            this.categories.initialize();
                            this.cities.initialize();
                        },
                        categories : {
                            initialize : function () {
                                $('.ui.categories.dropdown').dropdown(module.semantic.elements.dropdown.settings);
                            }
                        },
                        cities : {
                            initialize : function () {
                                $('.ui.cities.dropdown').dropdown(module.semantic.elements.dropdown.settings);
                            }
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
