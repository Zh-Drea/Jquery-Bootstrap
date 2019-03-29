var PAGE_DOMS = {
    PAGE_DATA_TABLE: '#page-data-table'
};
var PAGE_URLS = {
    GET_PAGE: contextPath + '/scheduleJob/getPage',
    DELETE: contextPath + '/scheduleJob/delete',
    REFRESH: contextPath + '/scheduleJob/execute'
};

var toolbarListener = function () {

    $('#toolbar button').attr('disabled', 'disabled');

    $('#toolbar #btn-add').removeAttr('disabled');

    var rows = $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelections();

    var length = rows.length;

    if (length === 1) {
        $('#toolbar #btn-edit').removeAttr('disabled');

        $('#toolbar #btn-ref').removeAttr('disabled');
    }
    if (length > 0) {
        $('#toolbar #btn-del').removeAttr('disabled');
    }

};

var queryParams = {};

var initBootstrapTables = function () {

    var options = {

        url: PAGE_URLS.GET_PAGE,

        toolbar: '#toolbar',

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
            field: 'jobName',
            title: '任务名称',
            align: 'center'
        }, {
            field: 'jobGroup',
            title: '任务分组',
            align:'center'
        }, {
            field: 'serviceUrl',
            title: '服务地址',
            align:'center'
        }, {
            field: 'interfaceUrl',
            title: '接口地址',
            align:'center'
        }, {
            field: 'cronExpression',
            title: '定时任务表达式',
            align:'center'
        }, {
            field: 'scheduleStatus',
            title: '开启状态',
            align:'center',
            formatter: function (obj, row, index) {
                return obj ? constantsEnumData.scheduleStatus[obj].name : null;
            }
        }, {
            field: 'triggerState',
            title: '执行状态',
            align:'center',
            formatter: function (obj, row, index) {
                return obj ? constantsEnumData.triggerState[obj].name : null;
            }
        }, {
            field: 'remark',
            title: '详细备注',
            align:'center'
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

        if('refresh' === optHandle) {

            var p = {
                id: $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow().id
            };

            var result = $.sendRequest(PAGE_URLS.REFRESH, JSON.stringify(p));

            if (!checkRespCodeSuccess(result)) {
                new Message().show(result.errDesc);
                return;
            }

            $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableSelectFirstPage();

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

        new Message().openView({
            content: [contextPath + '/scheduleJob/editPage', 'no'],
            title: title,
            area: ['800px', '390px']
        }, 'initPage', callParams, 'saveOrUpdate', null, editedCallback, yesCallbackParams);

    });

};

$(function () {

    initPageDom();

    initBootstrapTables();

    toolbarListener();

});