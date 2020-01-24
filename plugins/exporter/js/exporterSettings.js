(function ($, window, document) {

    'use strict';

    $(function () {

        const module = {

            $wrapper : $('#billboardExporterSettings__wrapper'),

            skeleton : {

                attributes : {
                    namespace : {
                        module : 'billboardExporterSettings'
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
                    }
                }
            },

            components : {

                exporter : {

                    selector : {
                        button : {
                            advertsExport : '.adverts-export-bttn',
                            categoriesExport : '.categories-export-bttn',
                            partnersExport : '.partners-export-bttn',
                            citiesExport : '.cities-export-bttn'
                        },
                        dropdown : {
                            adverts : '.ui.adverts.dropdown',
                            categories : '.ui.categories.dropdown',
                            partners : '.ui.partners.dropdown',
                            cities : '.ui.cities.dropdown'
                        }
                    },

                    event : {

                        click : {
                            onAdvertsExport : function (event) {

                                let $button = $(this);

                                let $progres = $('.ui.adverts.progress');

                                $progres.show();

                                module.components.exporter.disableAll();

                                module.components.runner.start();
                            },

                            onCategoriesExport : function (event) {

                                let $button = $(this);

                                let $progres = $('.ui.categories.progress');

                                $progres.show();

                                module.components.exporter.disableAll();

                                module.components.runner.start();
                            },

                            onPartnersExport : function (event) {

                                let $button = $(this);

                                let $progres = $('.ui.partners.progress');

                                $progres.show();

                                module.components.exporter.disableAll();

                                module.components.runner.start();
                            },

                            onCitiesExport : function (event) {

                                let $button = $(this);

                                let $progres = $('.ui.cities.progress');

                                $progres.show();

                                module.components.exporter.disableAll();

                                module.components.runner.start();
                            }
                        }

                    },

                    disableAll : function () {
                        $('.ui.dropdown').addClass('disabled');
                        $('.primary.bttn').remove();
                        $('.ui.tabs.menu').find('.item:not(.active)').addClass('disabled');
                    }
                },

                runner : {
                    url : '?plugin=exporter&module=backend&action=run',
                    processId : undefined,

                    start : function () {

                        let type = $('.ui.active.tab').data('tab');

                        let values = module.components.runner.serialize.values();

                        let dateFrom = module.components.runner.serialize.date.from();
                        let dateTo   = module.components.runner.serialize.date.to();

                        //первый запуск скрипта
                        $.post(module.components.runner.url, {
                            type : type,
                            values : values,
                            date_from : dateFrom,
                            date_to : dateTo
                        }, function (r) {
                            if (r && r.processId) {
                                module.components.runner.processId = r.processId;
                                module.components.runner.step();
                            } else if (r && r.error) {
                                alert(r.error);
                            } else {
                                alert('Server error');
                            }
                        }, 'json').error(function () {
                            alert('Server error');
                        });

                    },
                    step : function (delay) {

                        delay = delay || 2000;

                        let $activeTab = $('.ui.active.tab');

                        let type = $activeTab.data('tab');

                        let values = module.components.runner.serialize.values();

                        let dateFrom = module.components.runner.serialize.date.from();
                        let dateTo   = module.components.runner.serialize.date.to();


                        let $progress = $activeTab.find('.ui.progress');

                        var timer_id = setTimeout(function () {
                            $.post(
                                module.components.runner.url,
                                {
                                    processId : module.components.runner.processId,
                                    type : type,
                                    values : values,
                                    date_from : dateFrom,
                                    date_to : dateTo
                                },
                                function (r) {
                                    if (! r) {
                                        module.components.runner.step(3000);
                                    } else if (r && r.ready) {

                                        //получаем отчет о выполненной работе
                                        $.post(module.components.runner.url, {
                                            processId : module.components.runner.processId,
                                            type : type,
                                            values : values,
                                            date_from : dateFrom,
                                            date_to : dateTo,
                                            cleanup : 1
                                        }, function (r) {
                                            $progress
                                                .progress('set success')
                                                .progress('complete');

                                            if (r.file) {

                                                let content = `<div class="segment" style="text-align: center">
                                                                   <a href="?plugin=exporter&module=backend&action=download&file=${r.file}" class="ui bttn"><i class="download icon"></i> Скачать</a>
                                                               </div>`;

                                                $progress.after(content);

                                            }
                                            // if (r.report) {
                                            //     setTimeout(function () {
                                            //         //показываем отчет пользователю
                                            //         // $('.progressbar').hide();
                                            //         // $('.report').show();
                                            //         // $('.report').html(r.report);
                                            //     }, 1000);
                                            // }
                                        }, 'json');

                                    } else if (r && r.error) {
                                        //если произошла ошибка, показываем ее текст
                                        //и прекращаем работу
                                        $progress.addClass('error');

                                    } else {
                                        //если все нормально, обновляем значение индикатора
                                        if (r && r.progress) {
                                            var progress = parseFloat(r.progress.replace(/,/, '.'));
                                            // $('.progressbar .progressbar-inner').animate({
                                            //                                                  'width' : progress + '%'
                                            //                                              });
                                            // $('.progressbar-description').text(r.progress);
                                            // $('.progressbar-hint').text(r.hint);

                                            $progress.progress('set percent', progress);

                                        }

                                        //если конроллер вернул предупреждение,
                                        //показываем его пользователю и продолжаем работу
                                        if (r && r.warning) {
                                            $progress.addClass('warning');
                                        }

                                        //переходим к следующему запросу к серверу
                                        module.components.runner.step();
                                    }
                                },
                                'json'
                            ).error(function () {
                                //если при выполнении POST-запроса возникла ошибка
                                //повторим попытку через несколько секунд
                                module.components.runner.step(3000);
                            });
                        }, delay);
                    },

                    serialize : {
                        values : function () {

                            let values = [];

                            let $dropdown = $('.ui.active.tab').find('.ui.dropdown');

                            let dropdownValue = $.trim($dropdown.dropdown('get value'));

                            if (dropdownValue !== '') {
                                values = dropdownValue.split(',');
                            }

                            return values
                        },
                        date : {
                            from : function () {
                                return $('.ui.active.tab').find('input[name="date_from"]').val();
                            },
                            to : function () {
                                return $('.ui.active.tab').find('input[name="date_to"]').val();
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

                    },
                    delegated : function () {

                        let eventnamespace = module.skeleton.computed.namespace.event();

                        module.$wrapper

                              .on(
                                  'click' + eventnamespace,
                                  module.components.exporter.selector.button.advertsExport + module.skeleton.attributes.selector.notLoading,
                                  module.components.exporter.event.click.onAdvertsExport
                              )

                              .on(
                                  'click' + eventnamespace,
                                  module.components.exporter.selector.button.categoriesExport + module.skeleton.attributes.selector.notLoading,
                                  module.components.exporter.event.click.onCategoriesExport
                              )

                              .on(
                                  'click' + eventnamespace,
                                  module.components.exporter.selector.button.partnersExport + module.skeleton.attributes.selector.notLoading,
                                  module.components.exporter.event.click.onPartnersExport
                              )

                              .on(
                                  'click' + eventnamespace,
                                  module.components.exporter.selector.button.citiesExport + module.skeleton.attributes.selector.notLoading,
                                  module.components.exporter.event.click.onCitiesExport
                              )
                        ;
                    }
                }
            },

            semantic : {
                initialize : function () {
                    this.elements.tab.initialize();
                    this.elements.dropdown.initialize();
                    this.elements.progress.initialize();
                },
                elements : {
                    tab : {
                        initialize : function () {
                            $('.ui.tabs .item').tab();
                        }
                    },
                    dropdown : {
                        adverts : {
                            init : function () {

                                $(module.components.exporter.selector.dropdown.adverts)
                                    .dropdown({
                                                  clearable : true,
                                                  selectOnKeydown : false,
                                                  forceSelection : false,
                                                  saveRemoteData : false,
                                                  apiSettings : {
                                                      url : '?plugin=exporter&module=backend&action=advertsSearch&query={query}',
                                                      cache : false,
                                                      onResponse : function (jsonResponse) {
                                                          return { results : Object.values(jsonResponse.data.results) };
                                                      }
                                                  },
                                                  onLabelCreate : function (value, text) {

                                                      let $label = $(this);

                                                      $label.html(`#${value} | ${text} <i class="delete icon"></i>`);

                                                      return $label;
                                                  },
                                                  onChange : function (value, text, $choice) {

                                                      let $button = $(module.components.exporter.selector.button.advertsExport);

                                                      if (value !== '') {
                                                          $button.removeClass('disabled');
                                                      } else {
                                                          $button.addClass('disabled');
                                                      }
                                                  }
                                              });
                            }
                        },
                        categories : {
                            init : function () {

                                $(module.components.exporter.selector.dropdown.categories)
                                    .dropdown({
                                                  clearable : true,
                                                  selectOnKeydown : false,
                                                  forceSelection : false,
                                                  saveRemoteData : false,
                                                  apiSettings : {
                                                      url : '?plugin=exporter&module=backend&action=categoriesSearch&query={query}',
                                                      cache : false,
                                                      onResponse : function (jsonResponse) {
                                                          return { results : Object.values(jsonResponse.data.results) };
                                                      }
                                                  },
                                                  onLabelCreate : function (value, text) {

                                                      let $label = $(this);

                                                      $label.html(`#${value} | ${text} <i class="delete icon"></i>`);

                                                      return $label;
                                                  },
                                                  onChange : function (value, text, $choice) {

                                                      let $button = $(module.components.exporter.selector.button.categoriesExport);

                                                      if (value !== '') {
                                                          $button.removeClass('disabled');
                                                      } else {
                                                          $button.addClass('disabled');
                                                      }
                                                  }
                                              });
                            }

                        },
                        partners : {
                            init : function () {

                                $(module.components.exporter.selector.dropdown.partners)
                                    .dropdown({
                                                  clearable : true,
                                                  selectOnKeydown : false,
                                                  forceSelection : false,
                                                  saveRemoteData : false,
                                                  apiSettings : {
                                                      url : '?plugin=exporter&module=backend&action=partnersSearch&query={query}',
                                                      cache : false,
                                                      onResponse : function (jsonResponse) {
                                                          return { results : Object.values(jsonResponse.data.results) };
                                                      }
                                                  },
                                                  onLabelCreate : function (value, text) {

                                                      let $label = $(this);

                                                      $label.html(`#${value} | ${text} <i class="delete icon"></i>`);

                                                      return $label;
                                                  },
                                                  onChange : function (value, text, $choice) {

                                                      let $button = $(module.components.exporter.selector.button.partnersExport);

                                                      if (value !== '') {
                                                          $button.removeClass('disabled');
                                                      } else {
                                                          $button.addClass('disabled');
                                                      }
                                                  }
                                              });
                            }
                        },
                        cities : {
                            init : function () {

                                $(module.components.exporter.selector.dropdown.cities)
                                    .dropdown({
                                                  clearable : true,
                                                  selectOnKeydown : false,
                                                  forceSelection : false,
                                                  saveRemoteData : false,
                                                  apiSettings : {
                                                      url : '?plugin=exporter&module=backend&action=citiesSearch&query={query}',
                                                      cache : false,
                                                      onResponse : function (jsonResponse) {
                                                          return { results : Object.values(jsonResponse.data.results) };
                                                      }
                                                  },
                                                  onLabelCreate : function (value, text) {

                                                      let $label = $(this);

                                                      $label.html(`#${value} | ${text} <i class="delete icon"></i>`);

                                                      return $label;
                                                  },
                                                  onChange : function (value, text, $choice) {

                                                      let $button = $(module.components.exporter.selector.button.citiesExport);

                                                      if (value !== '') {
                                                          $button.removeClass('disabled');
                                                      } else {
                                                          $button.addClass('disabled');
                                                      }
                                                  }
                                              });
                            }
                        },

                        initialize : function () {
                            this.adverts.init();
                            this.categories.init();
                            this.partners.init();
                            this.cities.init();
                        }
                    },
                    progress : {
                        initialize : function () {
                            $('.ui.progress').progress({
                                                           autoSuccess : true,
                                                           showActivity : true,
                                                           text : {
                                                               active : '{percent}%',
                                                               success : '100%'
                                                           },
                                                           total : 100
                                                       })
                        }
                    }
                }
            },

            datepicker : {
                initialize : function () {
                    $('.date-input').datepicker({
                                                    format : 'dd/mm/yyyy',
                                                    language : 'ru'
                                                });
                }
            },

            initialize : function () {

                this.semantic.initialize();

                this.datepicker.initialize();

                this.events.bind.all();
            }

        };

        module.initialize();

    });

}(jQuery, window, document));
