var PAGE_DOMS = {
    PAGE_DATA_TABLE: '#page-data-table'
};

var PAGE_URLS = {

    GET_PAGE: contextPath + '/applyRefund/getAfterSalePage',

    REFUND : contextPath + '/applyRefund/refund'
};

var msg = new Message();

var toolbarListener = function () {

    $('#toolbar button').attr('disabled', 'disabled');

    var rows = $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelections();

    var length = rows.length;

    if (length === 1) {

        $('#toolbar #btn-query').removeAttr('disabled');

        $('#toolbar #btn-item-query').removeAttr('disabled');

        if (rows[0].applyRefundProgress === 'NOT_AUDIT' || rows[0].applyRefundProgress === 'AUDIT_PASS' || rows[0].applyRefundProgress === 'AUDIT_NOT_PASS') {

            $('#toolbar #btn-audit').removeAttr('disabled');
        }

        if (rows[0].applyRefundProgress === 'AUDIT_PASS' || rows[0].applyRefundProgress === 'REFUND_PROCESSING') {

            $('#toolbar #btn-money-agree').removeAttr('disabled');
        }
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
            field: 'serialNo',
            title: '退款流水号',
            align: 'center'

        }, {
            field: 'user',
            title: '退款用户电话',
            align: 'center',
            formatter:function (value, row, index) {
                return value ? value.phoneNo : null;
            }
        } ,{
            field: 'applyRefundType',
            title: '退款类型',
            align: 'center',
            formatter: function (obj, row, index) {
                return constantsEnumData.applyRefundType[obj].name;
            }
        }, {
            field: 'applyRefundProgress',
            title: '退款进度',
            align: 'center',
            formatter: function (obj, row, index) {
                return constantsEnumData.applyRefundProgress[obj].name;
            }
        }, {
            field: 'afterSaleRefundType',
            title: '售后退款类型',
            align: 'center',
            formatter: function (obj, row, index) {
                return constantsEnumData.afterSaleRefundType[obj].name;
            }
        }, {
            field: 'orderInfo',
            title: '业务订单号',
            align: 'center',
            formatter:function (value, row, index) {
                return value ? value.businessOrderNo : null;
            }
        } ,{
            field: 'applyRefundAmount',
            title: '申请退款金额',
            align: 'center'
        }, {
            field: 'agreeRefundAmount',
            title: '同意退款金额',
            align: 'center'
        }, {
            field: 'applyRefundDatetime',
            title: '申请退款时间',
            align: 'center'
        }, {
            field: 'refundReason',
            title: '退款原因',
            align: 'center',
            formatter:function (value, row, index) {
                return value ? value.value : row.refundOtherReason;
            }
        }, {
            field: 'problemDesc',
            title: '问题描述',
            align: 'center'
        }, {
            field: 'rejectReason',
            title: '拒绝原因',
            align: 'center'
        },{
            field: 'auditDatetime',
            title: '审核时间',
            align: 'center'
        },{
            field: 'executeRefundDatetime',
            title: '执行退款时间',
            align: 'center'
        },{
            field: 'cancelDatetime',
            title: '取消时间',
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

    var result = params.result;

    if (!result) {
        return;
    }

    if (checkRespCodeSuccess(result)) {

        layer.close(params.layerIndex);

        $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRefreshCurrentPage();

        return;
    }
    new Message().show(result.errDesc);
};

//确认退款
function auditCallBack() {

    var callParams = {
        id: $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow().id
    };

    var result = $.sendRequest(PAGE_URLS.REFUND ,JSON.stringify(callParams));

    if (!checkRespCodeSuccess(result)) {

        msg.show(result.errDesc);

        return;

    }

    $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRefreshCurrentPage();
}

var initPageDom = function () {

    $('#managerType').hide();

    if ($('#managerType').text() !== 'SUPER') {

        $('#btn-money-agree').hide();
    }

    $('#page-data-query-btn').click(function () {

        var res = $('#page-data-query-form').serializeJson();

        if (res.applyRefundProgress === "") {

            res.applyRefundProgress=null;

        }

         if (res.afterSaleRefundType === "") {

            res.afterSaleRefundType=null;

        }

        queryParams = res ;

        $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableSelectFirstPage();
    });

    $('#btn-query').click(function () {

        var callParams = {
            applyRefundId: $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow().id
        };

        new Message().openView({
            content: [contextPath + '/applyRefundRefAttachment/showPage'],
            title: "查看退款照片",
            area: ['520px', '500px']
        }, 'initPage', callParams, null, null, null, null);

    });

    $('#btn-item-query').click(function () {

        var callParams = {
            applyRefundId: $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow().id
        };

        new Message().openView({
            content: [contextPath + '/applyRefundRefOrderInfoItem/mainPage'],
            title: "查看退款明细",
            area: ['1110px', '550px']
        }, 'initPage', callParams, null, null, null, null);

    });

    $('#btn-audit').click(function () {

        var callParams = {
            row: $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow()
        };

        new Message().openView({
            content: [contextPath + '/audit/editPage'],
            title: "审核",
            area: ['420px', '346px']
        }, 'initPage', callParams,'saveOrUpdate', null, editedCallback, null);

    });

    $('#btn-money-agree').click(function () {

        msg.confirm('确认退款?' , auditCallBack);

    });

    $.each(constantsEnumData.applyRefundType, function (index, obj) {

        $('<OPTION>').val(obj.value).text(obj.name).appendTo($('#apply-refund-type-select'));

    });

    $.each(constantsEnumData.applyRefundProgress, function (index, obj) {

        $('<OPTION>').val(obj.value).text(obj.name).appendTo($('#apply-refund-progress-select'));

    });

    $.each(constantsEnumData.afterSaleRefundType, function (index, obj) {

        $('<OPTION>').val(obj.value).text(obj.name).appendTo($('#after-sale-refund-type-select'));

    });
};

$(function () {

    initPageDom();

    initBootstrapTables();

    toolbarListener();

});