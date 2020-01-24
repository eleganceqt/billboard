$(document).ready(function () {

    var toggleBody = function () {
        var $body = $('body');
        $body.hasClass('modal-open') ? $body.removeClass('modal-open') : $body.addClass('modal-open');
        return $body.hasClass('modal-open');
    }


    // header
    var header = {
        init: function () {
            var that                = this;
            that.$header_wrapper    = $('#header');
            that.$nav_wrapper       = $('.nav-mobile');

            
            header.search.apply(that);
            header.navBar.apply(that);
        },
        search: function (elems) {
            var that        = this,
                $wrap       = that.$header_wrapper.find('.header_search'),
                $show_btn   = $wrap.find('.bnt-search-show_icon'),
                $hide_btn   = $wrap.find('.bnt-search-hide_icon');
            
            
            function onShow ( self ) {
                $wrap.removeClass('hidden').addClass('active');
            }
            function onHide( self ) {
                $wrap.removeClass('active').addClass('hidden');
            }

            function bindEvents () {
                $show_btn.click(function (e) {
                    return onShow(e);
                });
                $hide_btn.click(function (e) {
                    return onHide(e);
                });
            }
            bindEvents();
        },
        navBar: function ( elems ) {
            var that            = this,
                $wrap           = that.$nav_wrapper,
                $menu_btn       = $wrap.find('.n-menu'),
                $user_btn       = $wrap.find('.n-user'),
                $dropdown_wrap  = $wrap.find('.user-drop'),
                $sidebar        = $('#cat-modal'),
                isLoaded        = $sidebar.data('loaded');
                sidebar_href    = '/sidebar/';

            
            function toggleShowCats(self) {
                isLoaded == false ? getCats() : showCats();
                
                function showCats () {
                    $wrap.toggleClass('active');
                    $sidebar.toggleClass('active');
                    toggleBody();
                }
                function getCats () {
                    var getSideBar = $.post(sidebar_href, function () {})
                    .done(function (html) {
                        $sidebar.data('loaded', 'true');
                        isLoaded = $sidebar.data('loaded');
                        $sidebar.append(html);
                        showCats();
                    })
                    .fail(function () {
                        alert("Ошибка загрузки категорий. Обратитесь в службу поддержки!");
                    })
                    .always(function () {
                        // alert("Ошибка загрузки категорий. Обратитесь в службу поддержки!");
                    });
                }
            }

            function toggleShowUserNav () {
                $dropdown_wrap.toggleClass('active');
            }

            function bindEvents(e) {
                $menu_btn.click(function (e) {
                    return toggleShowCats();
                });
                $user_btn.click(function (e) {
                    return toggleShowUserNav();
                });
            }
            bindEvents();
        }
    }
    header.init();

    // main slider
    var mainSlider = {
        init: function () {
            $('.owl-carousel').owlCarousel({
                loop: true,
                margin: 15,
                nav: true,
                dots: false,
                items: 1,
                navText: [
                    "<i class='owl-arr-left'></i>",
                    "<i class='owl-arr-right'></i>"
                ],
                // autoplay: true,
                // autoplayHoverPause: true,
                responsive: {
                    0: {
                        items: 1
                    },
                    600: {
                        items: 1
                    },
                    1400: {
                        items: 1
                    }
                }
            });
        }
    }
    mainSlider.init();

    // main Search and Filter
    var mainSearchFilter = {
        init: function () {
            var that = this;
                that.$wrapper = $('.main-search-filter');


            mainSearchFilter.search.apply(that);
            // mainSearchFilter.filter.apply(that);
        },
        search: function () {
            var that = this,
                $show_btn     = that.$wrapper.find('.js-show-filter'),
                $hide_btn     = that.$wrapper.find('.js-hide-filter'),
                $clear_search = that.$wrapper.find('.bnt-search-clear');
                $input        = that.$wrapper.find('#filter-search_text');
                $submin_wrap  = that.$wrapper.find('.submit-wrap');
                
            function toggleShow(self) {
                isFilterShown = that.$wrapper.find('#filter').attr('data-shown');
                isFilterShown == 'false' ? showFilter() : hideFilter();

                function showFilter() {
                    that.$wrapper.find('#filter').attr('data-shown', true);
                    $show_btn.css('display', 'none');
                    $hide_btn.css('display', 'inline-flex');
                }
                function hideFilter() {
                    that.$wrapper.find('#filter').attr('data-shown', false);
                    $show_btn.css('display', 'inline-flex');
                    $hide_btn.css('display', 'none');
                }
            }
            function ClearSearch() { $input.val(''); }

            function focusSearch() { $submin_wrap.toggleClass('active'); }

            
            function bindEvents(e) {
                $show_btn.click(function (e)     { return toggleShow(); });
                $hide_btn.click(function (e)     { return toggleShow(); });
                $clear_search.click(function (e) { return ClearSearch(); });
                $input.focus(function (e)        { return focusSearch(); });
                $input.focusout(function (e)     { setTimeout(function () { focusSearch(); }, 500) });
            }
            bindEvents();
        },
        filter: function  (  ) {
            var that          = this,
                $filter       = that.$wrapper.find('#filter'),
                isFilterShown = $filter.attr('data-shown');
                $show_btn     = that.$wrapper.find('.js-show-filter'),
                $hide_btn     = that.$wrapper.find('.js-hide-filter'),
                
            function toggleShow(self) {
                isFilterShown = $filter.attr('data-shown');
                isFilterShown == 'false' ? showFilter() : hideFilter();

                function showFilter() {
                    that.$wrapper.find('#filter').attr('data-shown', true);
                    $show_btn.css('display', 'none');
                    $hide_btn.css('display', 'inline-flex');
                }
                function hideFilter() {
                    that.$wrapper.find('#filter').attr('data-shown', false);
                    $show_btn.css('display', 'inline-flex');
                    $hide_btn.css('display', 'none');
                }
            }();
        }
    }
    mainSearchFilter.init();

    // advert Page
    var advertPage = {
        init: function () {
            var that = this;
                that.$wrapper = $('#advert');

            advertPage.infoBlock.apply(that);
            advertPage.favorites.apply(that);
        },
        infoBlock: function () {
            var that = this,
                $show_btn     = that.$wrapper.find('.js-shop-phone'),
                $number_href  = $show_btn.attr('data-number'),
                $number_inner = $show_btn.attr('data-number-inner');
            
            var template_html = "<a href='" + $number_href + "'><i class='phone square icon'></i>" + $number_inner + "</a>";
                $number_href == ''   ? template_html = "<p>Номер не указан</p>" : template_html = template_html;
                $number_href == null ? template_html = "<p>Номер не указан</p>" : template_html = template_html;
            
            function showPhone () {
                $show_btn.empty().append($(template_html));
                $show_btn.removeClass('button-blue').addClass('button-invert');
            }

            function bindEvents(e) {
                $show_btn.click(function (e) { return showPhone(); });
            }
            bindEvents();
        },
        favorites: function () {
            var that = this,
                guest = 'guest',
                user = 'user',
                $star = that.$wrapper.find('.star');


            function showErrorMessage(event) {
                var $this = $(event.target);
                $this.$star = $this.parents('.star');
                $this.$wrapper = that.$wrapper;
                

                var $message = $this.$wrapper.find('.ui[class*="left pointing"].label'),
                    isAuth = $this.$star.hasClass('guest');
                    isAuth == true ? $message.toggleClass('active') : console.log();

                $(document).mouseup(function (e) {
                    var $current = $message;
                    if (!$current.is(e.target) && $current.has(e.target).length === 0) {
                        $message.removeClass('active');
                    }
                });
            }

            function bindEvents(e) {
                $star.hasClass('guest') ?
                    $star.click(function (e) { return showErrorMessage(e); })
                    :
                    console.log();
            }
            bindEvents();
        }
    }
    advertPage.init();


    // List thumbs
    var listThumbs = {
        init: function () {
            var that = this;
                that.$wrapper = $('.list-thumbs');

            listThumbs.favorites.apply(that);
        },
        favorites: function () {
            var that = this,
                guest = 'guest',
                user = 'user',
                $star = that.$wrapper.find('.star');


            function showErrorMessage(event) {
                var $this = $(event.target);
                    $this.$star = $this.parents('.star');
                    $this.$wrapper = $this.$star.parents('.thumb-info');

                var $message = $this.$wrapper.find('.ui[class*="left pointing"].label'),
                    isAuth = $this.$star.hasClass('guest');
                
                isAuth == true ? $message.toggleClass('active') : console.log();

                $(document).mouseup(function (e) {
                    var $current = $message;
                    if (!$current.is(e.target) && $current.has(e.target).length === 0) { 
                        $message.removeClass('active');
                    }
                });
            }

            function bindEvents(e) {
                $star.hasClass('guest') ?
                    $star.click(function (e) { return showErrorMessage(e); })
                                        :
                    console.log();
            }
            bindEvents();
        }
    }
    listThumbs.init();


});
