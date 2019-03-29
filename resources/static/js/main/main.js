var PAGE_URLS = {
    ALL_MAIN_MENUS: contextPath + '/manager/loadManagerTree'
};

var msg =new Message();

function initMenus() {

    var menus = $('#menus');

    var result = $.sendRequest(PAGE_URLS.ALL_MAIN_MENUS);

    if (!checkRespCodeSuccess(result)) {

        msg.show(result.errDes);

        return;
    }
    var menusTree = result.data;

    $.each(menusTree, function (index, item) {

        var itemed = index === 0 ? ' layui-nav-itemed' : '';

        var li = $('<LI>').addClass('layui-nav-item' + itemed);

        $('<A>').attr('href', 'javascript:;').html(item.title).addClass('menu-item').data({
            'title': item.title,
            'url': item.url
        }).appendTo(li);

        if (item.subMenus) {

            var dl = $('<DL>').addClass('layui-nav-child');

            $.each(item.subMenus, function (index, subItem) {

                $('<DD>').append($('<A>').attr('href', 'javascript:;').html(subItem.title).addClass('menu-item').data({
                    'title': subItem.title,
                    'url': subItem.url
                })).appendTo(dl);
            });

            dl.appendTo(li);
        }

        li.appendTo(menus);
    });

    $('.menu-item').click(function () {

        var self = $(this);

        var data = self.data();

        if (data.url) {
            addPageTab(data.title, data.url);
        }
    });

}

function addPageTab(title, url, closable) {

    closable = typeof (closable) === 'boolean' ? closable : true;

    var tab = $('#page-tabs');

    if (tab.tabs('exists', title)) {

        tab.tabs('select', title);

        return;
    }

    tab.tabs('add', {
        title: title,
        closable: closable,
        content: $('<IFRAME>').attr({
            frameborder: 0,
            src: url
        }).height($('.page-content-panel').height() - 50).addClass('page-iframe')
    });

}

$(function () {

    initMenus();

    $('#page-tabs').tabs({
        tabHeight: 42,
        border: false,
        tabWidth: 150
    });

    addPageTab('首页', contextPath + '/home/statisticsPage', false);

    layui.use('element', function () {

        var element = layui.element;

        element.init();
    });

});

$(function () {

    $(window).resize(function () {

        setTimeout(function () {
            $('.page-iframe').each(function () {
                $(this).height($('.page-content-panel').height() - 50);
            })
        }, 50);
    });

});

$(function () {

    $('#basics').click(function () {

        addPageTab('基本资料', contextPath + '/home/basicsPage', true);
    });

    $('#changePassword').click(function () {

        addPageTab('修改密码', contextPath + '/home/changePasswordPage', true);
    });
});