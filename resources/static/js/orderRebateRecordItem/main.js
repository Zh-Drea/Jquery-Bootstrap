var REBATE_RECORD_ITEM_PAGE_DOMS = {
    PAGE_DATA_TABLE: '#page-orderRebateRecordItem-data-table'
};


var  REBATE_RECORD_ITEM_PAGE_URLS = {
    GET_PAGE: contextPath + '/orderRebateRecordItem/getPage'
};


var rebateRecordItemToolbarListener = function () {

};

var rebateRecordItemParams = {};

var initDetailBootstrapTable = function () {

    var options = {
        url: REBATE_RECORD_ITEM_PAGE_URLS.GET_PAGE,
        toolbar: '#toolbar-orderRebateRecordItem',
        singleSelect: true,
        queryParams: function (e) {
            return JSON.stringify($.extend(rebateRecordItemParams, {
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
            field: 'orderInfoItem',
            title: '子订单业务订单号',
            align: 'center',
            formatter:function (value, row, index) {
                return value ? value.subBusinessOrderNo : null;
            }
        },{
            field: 'coinTotal',
            title: '币数量',
            align: 'center'
        }, {
            field: 'coinType',
            title: '币类型',
            align: 'center',
            formatter:function (obj, row, index) {
                return constantsEnumData.coinType[obj].name;
            }
        }],
        onCheck: rebateRecordItemToolbarListener,
        onUncheck: rebateRecordItemToolbarListener,
        onCheckAll: rebateRecordItemToolbarListener,
        onUncheckAll: rebateRecordItemToolbarListener,
        onPageChange: function (number, size) {

            $(REBATE_RECORD_ITEM_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveAll();

            rebateRecordItemToolbarListener();
        },
        onRefresh: function () {

            $(REBATE_RECORD_ITEM_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveAll();

            rebateRecordItemToolbarListener();
        }
    };

    $(REBATE_RECORD_ITEM_PAGE_DOMS.PAGE_DATA_TABLE).initBootstrapTable(options, true);
};

var rebateRecordRecoveryInitialization = function () {

    rebateRecordItemParams = {};

    $(REBATE_RECORD_ITEM_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveAll();

};

$(function () {

    initDetailBootstrapTable();

    rebateRecordItemToolbarListener();
});