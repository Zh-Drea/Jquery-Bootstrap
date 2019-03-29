var PAGE_DOMS = {
    PAGE_DATA_TABLE: '#page-data-table'
};

var PAGE_URLS = {

    GET_PAGE: contextPath + '/integralRule/getPage',

    DELETE: contextPath + '/integralRule/delete'
};

var toolbarListener = function () {

    $('#toolbar button').attr('disabled', 'disabled');

    $('#toolbar #btn-add').removeAttr('disabled');

    var rows = $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelections();

    var length = rows.length;

    if (length === 1) {
        $('#toolbar #btn-edit').removeAttr('disabled');
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
            field: 'singleOrderMinDeductIntegralNum',
            title: '单笔订单最小抵扣积分数量',
            align: 'center'
        }, {
            field: 'singleOrderMaxDeductIntegralNum',
            title: '单笔订单最大抵扣积分数量',
            align: 'center'
        }, {
            field: 'rmbExchangeToIntegralRate',
            title: '人民币(元)换算成积分比例',
            align: 'center'
        }, {
            field: 'integralExchangeToRmbRate',
            title: '积分换算成人民币比例(元)',
            align: 'center'
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

        new Message().openView({
            content: [contextPath + '/integralRule/editPage', 'yes'],
            title: title,
            area: ['870px', '400px']
        }, 'initPage', callParams, 'saveOrUpdate', null, editedCallback, yesCallbackParams);
    });
};

$(function () {

    initPageDom();

    initBootstrapTables();

    toolbarListener();

});