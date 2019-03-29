var PAGE_DOMS = {
    PAGE_DATA_TABLE: '#page-data-table'
};

var PAGE_URLS = {

    GET_PAGE: contextPath + '/rebateRule/getPage',

    DELETE: contextPath + '/rebateRule/delete',

    REFRESH: contextPath + '/rebateRule/syncRebateRules'
};

var toolbarListener = function () {

    $('#toolbar button').attr('disabled', 'disabled');

    $('#toolbar #btn-add').removeAttr('disabled');

    var rows = $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelections();

    var length = rows.length;

    if (length === 1) {

        $('#toolbar #btn-edit').removeAttr('disabled');

        $('#toolbar #btn-edit-remark').removeAttr('disabled');

        $('#toolbar #btn-edit-enable').removeAttr('disabled');
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
            field: 'code',
            title: '编码',
            align: 'center'
        }, {
            field: 'ruleType',
            title: '返利类型',
            align: 'center'
        }, {
            field: 'ruleRemark',
            title: '规则备注',
            align: 'center'
        }, {
            field: 'ruleContent',
            title: '结算规则内容'
        }, {
            field: 'enable',
            title: '是否启用',
            align: 'center',
            formatter: function (value, row, index) {
                return value ? '是' : '否';
            }
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

        if (OPT_HANDLE.SAVE === optHandle) {
            $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableSelectFirstPage();
        } else {
            $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRefreshCurrentPage();
        }

        return;
    }

    new Message().show(result.errDesc);
};

function deleteCallback() {

    var ids = [];

    var rows = $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelections();

    $.each(rows, function (index, row) {
        ids.push(row.id);
    });

    var params = {
        ids: ids
    };

    $.sendRequest(PAGE_URLS.DELETE, JSON.stringify(params), {async: true}, function (result) {

        if (!checkRespCodeSuccess(result)) {
            new Message().show(result.errDesc);
            return;
        }

        $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveByUniqueIds(ids, true);
    });
}

var initPageDom = function () {

    $('#toolbar button').click(function () {

        var optHandle = $(this).attr('data-handle');

        if (OPT_HANDLE.DELETE === optHandle) {

            new Message().confirm('确定删除选中数据？', deleteCallback);

            return;
        }

        var callParams = {
        };

        var yesCallbackParams = {
            viewOptHandle: optHandle
        };

        if ('edit-remark' === optHandle) {
            callParams.id=$(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow().id;
            var optionsRefRemark = {
                content: [contextPath + '/rebateRuleRefRemark/editPage'],
                title: '修改返利规则备注',
                area: ['400px', '260px']
            };

            new Message().openView(optionsRefRemark, 'initPage', callParams, 'saveOrUpdate', null, editedCallback, yesCallbackParams);
        }

        if ('edit-enable' === optHandle) {
            callParams.id=$(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow().id;
            var optionsRefRemark = {
                content: [contextPath + '/rebateRuleRefEnable/editPage'],
                title: '修改返利规则备注',
                area: ['400px', '260px']
            };

            new Message().openView(optionsRefRemark, 'initPage', callParams, 'saveOrUpdate', null, editedCallback, yesCallbackParams);
        }


    });

    $('#btn-add').click(function () {

        var res = $.sendRequest(PAGE_URLS.REFRESH);

        if (!checkRespCodeSuccess(res)) {

            new Message().show(res.errDesc);

            return;
        }

        $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableSelectFirstPage();
    });

    $.each(constantsEnumData.userType, function (index, obj) {

        $('<OPTION>').val(obj.value).text(obj.name).appendTo($('#user-type-select'));
    });

    $.each(constantsEnumData.rebateType, function (index, obj) {

        $('<OPTION>').val(obj.value).text(obj.name).appendTo($('#rebate-type-select'));
    });

    $('#page-data-query-btn').click(function () {

        queryParams = $('#page-data-query-form').serializeJson();

        $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableSelectFirstPage();
    });
};

$(function () {

    initPageDom();

    initBootstrapTables();

    toolbarListener();

});