var PAGE_VALUE_DOMS = {
    PAGE_DATA_TABLE: '#page-value-data-table'
};
var PAGE_VALUE_URLS = {
    GET_PAGE: contextPath + '/dictValue/getPage',
    DELETE: contextPath + '/dictValue/delete'
};

var valueToolbarListener = function () {

    $('#toolbar-value #btn-edit-value').attr('disabled', 'disabled');

    $('#toolbar-value #btn-del-value').attr('disabled', 'disabled');

    var res = $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow();

    if(res) {

        var rows = $(PAGE_VALUE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelections();

        var length = rows.length;

        if (length === 1) {
            $('#toolbar-value #btn-edit-value').removeAttr('disabled');
        }
        if (length > 0) {
            $('#toolbar-value #btn-del-value').removeAttr('disabled');
        }
    }
};

var valueQueryParams = {};

var initValueBootstrapTables = function () {

    var options = {
        url: PAGE_VALUE_URLS.GET_PAGE,
        toolbar: '#toolbar-value',
        queryParams: function (e) {
            return JSON.stringify($.extend(valueQueryParams, {
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
        },{
            field: 'name',
            title: '字典名称',
            align:'center'
        }, {
            field: 'value',
            title: '字典值',
            align:'center'
        }, {
            field: 'remark',
            title: '详细备注',
            align:'center'
        }],
        onCheck: valueToolbarListener,
        onUncheck: valueToolbarListener,
        onCheckAll: valueToolbarListener,
        onUncheckAll: valueToolbarListener,
        onPageChange: function (number, size) {

            $(PAGE_VALUE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveAll();

            valueToolbarListener();
        },
        onRefresh: function () {

            $(PAGE_VALUE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveAll();

            valueToolbarListener();
        }

    };

    $(PAGE_VALUE_DOMS.PAGE_DATA_TABLE).initBootstrapTable(options, true);
};

var editedValueCallback = function (params) {

    var optHandle = params.yesCallbackParams.viewOptHandle;

    var result = params.result;

    if (!result) {
        return;
    }

    if (checkRespCodeSuccess(result)) {

        layer.close(params.layerIndex);

        if (OPT_HANDLE.UPDATE === optHandle) {
            $(PAGE_VALUE_DOMS.PAGE_DATA_TABLE).bootstrapTableRefreshCurrentPage();
        } else {
            $(PAGE_VALUE_DOMS.PAGE_DATA_TABLE).bootstrapTableSelectFirstPage();
        }

        return;
    }

    new Message().show(result.errDesc);
};

function deleteValueCallback() {

    var ids = [];

    var rows = $(PAGE_VALUE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelections();

    $.each(rows, function (index, row) {
        ids.push(row.id);
    });

    var params = {
        ids: ids
    };

    $.sendRequest(PAGE_VALUE_URLS.DELETE, JSON.stringify(params), {async: true}, function (result) {

        if (!checkRespCodeSuccess(result)) {

            new Message().show(result.errDesc);

            return;
        }

        $(PAGE_VALUE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveByUniqueIds(ids, true);
    });

}

var valueRecoveryInitialization = function () {

    valueQueryParams = {};

    $(PAGE_VALUE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveAll();

};

var initValuePageDom = function () {

    $('#toolbar-value button').click(function () {

        var title = $(this).attr('data-title-value');

        var optHandle = $(this).attr('data-handle-value');

        if (OPT_HANDLE.DELETE === optHandle) {

            new Message().confirm('确定删除选中数据？', deleteValueCallback);

            return;
        }

        var callParams = {
            dictTypeId : $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow().id
        };

        if (OPT_HANDLE.UPDATE === optHandle) {
            $.extend(callParams, {
                id: $(PAGE_VALUE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow().id
            })
        }

        var yesCallbackParams = {
            viewOptHandle: optHandle
        };

        new Message().openView({
            content: [contextPath + '/dictValue/editPage', 'no'],
            title: title,
            area: ['420px', '340px']
        }, 'initPage', callParams, 'saveOrUpdate', null, editedValueCallback, yesCallbackParams);

    });

};

$(function () {

    initValuePageDom();

    initValueBootstrapTables();

    valueToolbarListener();
});