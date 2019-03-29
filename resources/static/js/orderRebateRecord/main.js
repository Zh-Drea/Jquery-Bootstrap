var PAGE_DOMS = {
    PAGE_DATA_TABLE: '#page-data-table'
};

var PAGE_URLS = {
    GET_PAGE: contextPath + '/orderRebateRecord/getPage'
};

var toolbarListener = function () {

    var rows = $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelections();

    var length = rows.length;

    rebateRecordRecoveryInitialization();

    if (length === 1) {

        rebateRecordItemParams.rebateRecordId = rows[0].id;

        $(REBATE_RECORD_ITEM_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableSelectFirstPage();

    }

};

var queryParams = {};

var initBootstrapTables = function () {

    var options = {

        url: PAGE_URLS.GET_PAGE,
        toolbar: '#toolbar',
        singleSelect: true,
        clickToSelect: false,
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
            field: 'reachedUser',
            title: '获得返利用户电话',
            align:'center',
            formatter:function (value, row, index) {
                return value ? value.phoneNo : null;
            }
        }, {
            field: 'rebateUser',
            title: '返利用户电话',
            align: 'center',
            formatter:function (value, row, index) {
                return value ? value.phoneNo : null;
            }
        } ,{
            field: 'orderInfo',
            title: '返利订单业务单号',
            align:'center',
            formatter:function (value, row, index) {
                return value ? value.businessOrderNo : null;
            }
        }, {
            field: 'rebateOrigin',
            title: '返利来源',
            align:'center',
            formatter:function (obj, row, index) {
                return constantsEnumData.rebateOrigin[obj].name;
            }
        }, {
            field: 'coinTotal',
            title: '币数量',
            align:'center'
        }, {
            field: 'coinType',
            title: '币类型',
            align:'center',
            formatter:function (obj, row, index) {
                return constantsEnumData.coinType[obj].name;
            }
        }],
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


var initPageDom = function () {

    $.each(constantsEnumData.rebateOrigin, function (index, obj) {

        $('<OPTION>').val(obj.value).text(obj.name).appendTo($('#rebate-origin-select'));

    });

    $.each(constantsEnumData.coinType, function (index, obj) {

        $('<OPTION>').val(obj.value).text(obj.name).appendTo($('#coin-type-select'));

    });

    $('#page-data-query-btn').click(function () {

        var queryParam = $('#page-data-query-form').serializeJson();


        if (queryParam.coinType === "") {

            queryParam.coinType=null;

            queryParams =queryParam;
        }

        if (queryParam.rebateOrigin === "") {

            queryParam.rebateOrigin=null;

            queryParams =queryParam;
        }

        queryParams =queryParam;

        $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableSelectFirstPage();
    });

};

$(function () {

    initPageDom();

    initBootstrapTables();

    toolbarListener();

});