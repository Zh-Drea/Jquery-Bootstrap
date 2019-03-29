var PAGE_DOMS = {
    PAGE_DATA_TABLE: '#page-data-table'
};

var PAGE_URLS = {

    GET_PAGE: contextPath + '/role/getPage',

    DELETE: contextPath + '/role/delete',

    NEW_MENUS: contextPath + '/role/getMenuTreeByRole'
};

var msg = new Message();

var toolbarListener = function () {

    $('#toolbar button').attr('disabled', 'disabled');

    $('#toolbar #btn-add').removeAttr('disabled');

    var rows = $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelections();

    var length = rows.length;

    if (length === 1) {

        var roleId = {
            id: $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow().id
        };

        var result = $.sendRequest(PAGE_URLS.NEW_MENUS,JSON.stringify(roleId));

        if (!checkRespCodeSuccess(result)) {

            msg.show(result.errDesc);

            return;
        }

        treeView(result.data);

        $('#tree').show();

        $('#toolbar #btn-edit').removeAttr('disabled');

        $('#toolbar #btn-del').removeAttr('disabled');

        $('#toolbar #btn-dict-ref').removeAttr('disabled');
    }else {

        $('#tree').hide();
    }
};

var queryParams = {};
var initBootstrapTables = function () {

    var options = {

        url: PAGE_URLS.GET_PAGE,

        toolbar: '#toolbar',

        singleSelect:true,

        queryParams: function (e) {

            return JSON.stringify($.extend(queryParams, {
                page: {
                    pageNumber: (e.offset / e.limit) + 1,
                    pageSize: e.limit
                }
            }));
        },

        responseHandler: function (result) {
            if (checkRespCodeSuccess(result)) {
                return result.data;
            }

            new Message().show(result.errDesc);
        },
        columns: [{
            checkbox: true
        }, {
            field: 'name',
            title: '角色名',
            align: 'center'

        }, {
            field: 'remark',
            title: '备注',
            align: 'center'
        }
        ],
        onCheck: toolbarListener,
        onUncheck: toolbarListener,
        onCheckAll: toolbarListener,
        onUncheckAll: toolbarListener,
        onPageChange: function (number, size) {

            $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveAll();

            toolbarListener();
        },

        onRefresh: function () {

            $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveAll();

            toolbarListener();
        }

    };

    $(PAGE_DOMS.PAGE_DATA_TABLE).initBootstrapTable(options, true);
};

var editedCallback = function (params) {

    var optHandle = params.yesCallbackParams.viewOptHandle;

    var result = params.result;

    if (!result) {
        return;
    }

    if (checkRespCodeSuccess(result)) {

        layer.close(params.layerIndex);

        if (OPT_HANDLE.UPDATE === optHandle) {
            $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRefreshCurrentPage();
        } else {
            $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableSelectFirstPage();
        }

        return;
    }

    new Message().show(result.errDesc);
};


function deleteCallback() {

    var rows = $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow();

    var params = {
        id: rows.id
    };

    $.sendRequest(PAGE_URLS.DELETE, JSON.stringify(params), {async: true}, function (result) {

        if (!checkRespCodeSuccess(result)) {

            new Message().show(result.errDesc);
            return;
        }

        $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveByUniqueIds(params, true);
    });

}

var initPageDom = function () {

    $('#page-data-query-btn').click(function () {

        queryParams = $('#page-data-query-form').serializeJson();

        $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableSelectFirstPage();
    });

    $('#toolbar button').click(function () {

        var title = $(this).attr('data-title');

        var optHandle = $(this).attr('data-handle');

        if (OPT_HANDLE.DELETE === optHandle) {

            new Message().confirm('确定删除选中数据？', deleteCallback);

            return;
        }

        var callParams = {};

        if (OPT_HANDLE.UPDATE === optHandle) {
            $.extend(callParams, {

                id: $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow().id
            })
        }

        var yesCallbackParams = {
            viewOptHandle: optHandle
        };

        var index = new Message().openView({
            content: [contextPath + '/role/editPage'],
            title: title,
            area: ['420px', '360px']
        }, 'initPage', callParams, 'saveOrUpdate', null, editedCallback, yesCallbackParams);

        layer.full(index);

    });
};

$(function () {

    initPageDom();

    initBootstrapTables();

    toolbarListener();

});