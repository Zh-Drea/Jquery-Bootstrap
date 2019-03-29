var PAGE_INFO_DOMS = {
    PAGE_DATA_TABLE: '#page-data-info-table'
};

var PAGE_INFO_URLS = {
    GET_PAGE: contextPath + '/agentAmountStatistics/getOrderInfoPage'
};

var toolbarInfoListener = function () {
};

var queryInfoParams = {};

var initBootstrapInfoTables = function () {

    var options = {

        url: PAGE_INFO_URLS.GET_PAGE,

        toolbar: '#toolbar-info',

        singleSelect: true,

        queryParams: function (e) {

            return JSON.stringify($.extend(queryInfoParams, {
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
            field: 'businessOrderNo',
            title: '业务订单号',
            align: 'center'

        }, {
            field: 'currentDate',
            title: '当天日期',
            align: 'center'

        }, {
            field: 'amountCount',
            title: '交易金额',
            align: 'center'
        }
        ],
        onCheck: toolbarInfoListener,
        onUncheck: toolbarInfoListener,
        onCheckAll: toolbarInfoListener,
        onUncheckAll: toolbarInfoListener,
        onPageChange: function (number, size) {

            $(PAGE_INFO_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveAll();

            toolbarInfoListener();
        },

        onRefresh: function () {

            $(PAGE_INFO_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveAll();

            toolbarInfoListener();
        }

    };

    $(PAGE_INFO_DOMS.PAGE_DATA_TABLE).initBootstrapTable(options, true);
};

var infoRecoveryInitialization =function (){

    queryInfoParams = {};

    $(PAGE_INFO_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveAll();
};

var refreshInfoTable = function (p,o) {

    queryInfoParams.dateTime = p;

    queryInfoParams.userId = o;

    initBootstrapInfoTables();

    toolbarInfoListener();

};