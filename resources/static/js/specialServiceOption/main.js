var PAGE_OPTION_DOMS = {
    PAGE_DATA_TABLE: '#page-option-data-table'
};
var PAGE_OPTION_URLS = {
    GET_PAGE: contextPath + '/specialServiceOption/getPage',
    DELETE: contextPath + '/specialServiceOption/delete',
    GET_ALL_SPECIAL_SERVICE: contextPath + '/specialServiceOption/getAllSpecialService'
};

var serviceToolbarListener = function () {

    $('#toolbar-option #btn-edit-option').attr('disabled', 'disabled');

    $('#toolbar-option #btn-del-option').attr('disabled', 'disabled');

    var res = $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow();

    if(res) {

        var rows = $(PAGE_OPTION_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelections();

        var length = rows.length;

        if (length === 1) {
            $('#toolbar-option #btn-edit-option').removeAttr('disabled');
        }
        if (length > 0) {
                $('#toolbar-option #btn-del-option').removeAttr('disabled');
        }
    }
};

var serviceQueryParams = {};

var initServiceBootstrapTables = function () {

    var options = {
        url: PAGE_OPTION_URLS.GET_PAGE,
        toolbar: '#toolbar-option',
        queryParams: function (e) {
            return JSON.stringify($.extend(serviceQueryParams, {
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
            field: 'goodsModelRefSpecialService',
            title: '特殊服务名称',
            align:'center',
            formatter: function (value, row, index) {
                return value && value.specialService ? value.specialService.name : null;
            }
        }, {
            field: 'name',
            title: '服务选项名称',
            align: 'center'
        }, {
            field: 'price',
            title: '特殊服务价格',
            align: 'center'
        }, {
            field: 'enable',
            title: '是否启用',
            align: 'center',
            formatter:function (value,row,index) {
                return value ? "是" : "否";
            }
        }, {
            field: 'remark',
            title: '备注',
            align: 'center'
        }, {
            field: 'createDatetime',
            title: '创建时间',
            align: 'center',
            visible: false
        }, {
            field: 'updateDatetime',
            title: '修改时间',
            align: 'center',
            visible: false
        }],
        onCheck: serviceToolbarListener,
        onUncheck: serviceToolbarListener,
        onCheckAll: serviceToolbarListener,
        onUncheckAll: serviceToolbarListener,
        onPageChange: function (number, size) {

            $(PAGE_OPTION_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveAll();

            serviceToolbarListener();
        },
        onRefresh: function () {

            $(PAGE_OPTION_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveAll();

            serviceToolbarListener();
        }

    };

    $(PAGE_OPTION_DOMS.PAGE_DATA_TABLE).initBootstrapTable(options, true);
};

var editedServiceCallback = function (params) {

    var optHandle = params.yesCallbackParams.viewOptHandle;

    var result = params.result;

    if (!result) {
        return;
    }

    if (checkRespCodeSuccess(result)) {

        layer.close(params.layerIndex);

        if (OPT_HANDLE.UPDATE === optHandle) {
            $(PAGE_OPTION_DOMS.PAGE_DATA_TABLE).bootstrapTableRefreshCurrentPage();
        } else {
            $(PAGE_OPTION_DOMS.PAGE_DATA_TABLE).bootstrapTableSelectFirstPage();
        }

        return;
    }

    new Message().show(result.errDesc);
};

function deleteServiceCallback() {

    var ids = [];

    var rows = $(PAGE_OPTION_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelections();

    $.each(rows, function (index, row) {
        ids.push(row.id);
    });

    var params = {
        ids: ids
    };

    $.sendRequest(PAGE_OPTION_URLS.DELETE, JSON.stringify(params), {async: true}, function (result) {

        if (!checkRespCodeSuccess(result)) {

            new Message().show(result.errDesc);

            return;
        }

        $(PAGE_OPTION_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveByUniqueIds(ids, true);
    });

}

var optionRecoveryInitialization = function () {

    serviceQueryParams = {};

    $(PAGE_OPTION_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveAll();

};

var initServicePageDom = function () {

    $('#toolbar-option button').click(function () {

        var title = $(this).attr('data-title-option');

        var optHandle = $(this).attr('data-handle-option');

        if (OPT_HANDLE.DELETE === optHandle) {

            new Message().confirm('确定删除选中数据？', deleteServiceCallback);

            return;
        }

        var callParams = {
            goodsModelId : $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow().id
        };

        if (OPT_HANDLE.UPDATE === optHandle) {
            $.extend(callParams, {
                id: $(PAGE_OPTION_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow().id
            })
        }

        var yesCallbackParams = {
            viewOptHandle: optHandle
        };

        new Message().openView({
            content: [contextPath + '/specialServiceOption/editPage', 'no'],
            title: title,
            area: ['420px', '440px']
        }, 'initPage', callParams, 'saveOrUpdate', null, editedServiceCallback, yesCallbackParams);

    });

};

$(function () {

    initServicePageDom();

    initServiceBootstrapTables();

    serviceToolbarListener();
});