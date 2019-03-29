var PAGE_RULE_DOMS = {
    PAGE_DATA_TABLE: '#page-rule-data-table'
};

var PAGE_RULE_URLS = {
    GET_PAGE: contextPath + '/logisticRule/getPage',
    DELETE: contextPath + '/logisticRule/delete'
};

var pieceColumns = [{
    checkbox: true
}, {
    field: 'baseUnit',
    title: '首件数量',
    align: 'center'
}, {
    field: 'perAddUnit',
    title: '续件数量',
    align: 'center'
}, {
    field: 'baseUnitPrice',
    title: '首件费用',
    align: 'center'
}, {
    field: 'perAddUnitPrice',
    title: '续件费用',
    align: 'center'
}, {
    field: 'defaultRule',
    title: '是否默认',
    align: 'center',
    formatter: function (value, row, index) {
        return value ? '是' : '否';
    }
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
}];

var weightColumns = [{
    checkbox: true
}, {
    field: 'baseUnit',
    title: '首重重量',
    align: 'center'
}, {
    field: 'perAddUnit',
    title: '续重重量',
    align: 'center'
}, {
    field: 'baseUnitPrice',
    title: '首重费用',
    align: 'center'
}, {
    field: 'perAddUnitPrice',
    title: '续重费用',
    align: 'center'
}, {
    field: 'defaultRule',
    title: '是否默认',
    align: 'center',
    formatter: function (value, row, index) {
        return value ? '是' : '否';
    }
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
}];

var ruleToolbarListener = function () {

    $('#toolbar-rule #btn-edit-rule').attr('disabled', 'disabled');

    $('#toolbar-rule #btn-del-rule').attr('disabled', 'disabled');

    var rows = $(PAGE_RULE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelections();

    var length = rows.length;

    if (length === 1) {
        $('#toolbar-rule #btn-edit-rule').removeAttr('disabled');
    }
    if (length > 0) {
        $('#toolbar-rule #btn-del-rule').removeAttr('disabled');
    }
};

var ruleQueryParams = {};

var initRuleBootstrapTables = function () {

    var options = {
        url: PAGE_RULE_URLS.GET_PAGE,
        toolbar: '#toolbar-rule',
        singleSelect: true,
        queryParams: function (e) {
            return JSON.stringify($.extend(ruleQueryParams, {
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
        column: weightColumns,
        onCheck: ruleToolbarListener,
        onUncheck: ruleToolbarListener,
        onCheckAll: ruleToolbarListener,
        onUncheckAll: ruleToolbarListener,
        onPageChange: function (number, size) {

            $(PAGE_RULE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveAll();

            ruleToolbarListener();
        },
        onRefresh: function () {

            $(PAGE_RULE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveAll();

            ruleToolbarListener();
        }
    };

    $(PAGE_RULE_DOMS.PAGE_DATA_TABLE).initBootstrapTable(options, true);
};

var editedRuleCallback = function (params) {

    var optHandle = params.yesCallbackParams.viewOptHandle;

    var result = params.result;

    if (!result) {
        return;
    }

    if (checkRespCodeSuccess(result)) {

        layer.close(params.layerIndex);

        if (OPT_HANDLE.UPDATE === optHandle) {
            $(PAGE_RULE_DOMS.PAGE_DATA_TABLE).bootstrapTableRefreshCurrentPage();
        } else {
            $(PAGE_RULE_DOMS.PAGE_DATA_TABLE).bootstrapTableSelectFirstPage();
        }

        return;
    }

    new Message().show(result.errDesc);
};

function deleteRuleCallback() {

    var ids = [];

    var rows = $(PAGE_RULE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelections();

    $.each(rows, function (index, row) {
        ids.push(row.id);
    });

    var params = {
        ids: ids
    };

    $.sendRequest(PAGE_RULE_URLS.DELETE, JSON.stringify(params), {async: true}, function (result) {

        if (!checkRespCodeSuccess(result)) {

            new Message().show(result.errDesc);

            return;
        }

        $(PAGE_RULE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveByUniqueIds(ids, true);
    });

}

var ruleRecoveryInitialization = function () {

    ruleQueryParams = {};

    $(PAGE_RULE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveAll();

};

var initRulePageDom = function () {

    $('#toolbar-rule button').click(function () {

        var title = $(this).attr('data-title-rule');

        var optHandle = $(this).attr('data-handle-rule');

        if (OPT_HANDLE.DELETE === optHandle) {

            new Message().confirm('确定删除选中数据？', deleteRuleCallback);

            return;
        }

        var callParams = {
            logisticTemplateAll: $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow()
        };

        if (OPT_HANDLE.UPDATE === optHandle) {
            $.extend(callParams, {
                id: $(PAGE_RULE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow().id
            })
        }

        var yesCallbackParams = {
            viewOptHandle: optHandle
        };

        new Message().openView({
            content: [contextPath + '/logisticRule/editPage', 'no'],
            title: title,
            area: ['480px', '440px']
        }, 'initPage', callParams, 'saveOrUpdate', null, editedRuleCallback, yesCallbackParams);

    });

};

$(function () {

    initRulePageDom();

    initRuleBootstrapTables();

    ruleToolbarListener();
});