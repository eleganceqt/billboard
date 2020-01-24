(function ($, window, document) {

    $(function () {

        var url       = '?plugin=exporter&module=backend&action=run'; //URL, обрабатываемый контроллером waLongActionController
        var processId = undefined;

        var step = function (delay) {
            //интервал запросов к серверному контроллеру
            delay = delay || 2000;

            var timer_id = setTimeout(function () {
                $.post(
                    url,
                    { processId : processId },
                    function (r) {
                        if (! r) {
                            step(3000);
                        } else if (r && r.ready) {
                            //работа контроллера завершена
                            //устанавливаем индикатор выполнения процесса на значение 100%
                            $('.progressbar .progressbar-inner').css({
                                                                         width : '100%'
                                                                     });
                            $('.progressbar-description').text('100%');

                            //получаем отчет о выполненной работе
                            $.post(url, { processId : processId, cleanup : 1 }, function (r) {
                                if (r.report) {
                                    setTimeout(function () {
                                        //показываем отчет пользователю
                                        $('.progressbar').hide();
                                        $('.report').show();
                                        $('.report').html(r.report);
                                    }, 1000);
                                }
                            }, 'json');
                        } else if (r && r.error) {
                            //если произошла ошибка, показываем ее текст
                            //и прекращаем работу
                            $('.errormsg').text(r.error);
                        } else {
                            //если все нормально, обновляем значение индикатора
                            if (r && r.progress) {
                                var progress = parseFloat(r.progress.replace(/,/, '.'));
                                $('.progressbar .progressbar-inner').animate({
                                                                                 'width' : progress + '%'
                                                                             });
                                $('.progressbar-description').text(r.progress);
                                $('.progressbar-hint').text(r.hint);
                            }

                            //если конроллер вернул предупреждение,
                            //показываем его пользователю и продолжаем работу
                            if (r && r.warning) {
                                $('.progressbar-description').append('&lt;i class="icon16 exclamation"&gt;&lt;/i&gt;&lt;p&gt;' + r.warning + '&lt;/p&gt;');
                            }

                            //переходим к следующему запросу к серверу
                            step();
                        }
                    },
                    'json'
                ).error(function () {
                    //если при выполнении POST-запроса возникла ошибка
                    //повторим попытку через несколько секунд
                    step(3000);
                });
            }, delay);
        };

        $('.bttn.primary').click(function () {

            //первый запуск скрипта
            $.post(url, {}, function (r) {
                if (r && r.processId) {
                    processId = r.processId;
                    step();
                } else if (r && r.error) {
                    $('.errormsg').text(r.error);
                } else {
                    $('.errormsg').text('Server error');
                }
            }, 'json').error(function () {
                $('.errormsg').text('Server error');
            });

        });


    });

}(jQuery, window, document));
