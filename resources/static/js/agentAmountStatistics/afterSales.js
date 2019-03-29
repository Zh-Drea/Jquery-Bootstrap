var PAGE_AS_DOMS = {
    PAGE_DATA_TABLE: '#page-data-after-sales-table'
};

var PAGE_AS_URLS = {
    GET_PAGE: contextPath + '/agentAmountStatistics/getRefundOrderInfoPage'
};

var toolbarAsListener = function () {
};

var queryAsParams = {};

var initBootstrapAsTables = function () {

    var options = {

        url: PAGE_AS_URLS.GET_PAGE,

        toolbar: '#toolbar-after-sales',

        singleSelect: true,

        queryParams: function (e) {

            return JSON.stringify($.extend(queryAsParams, {
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
            title: '退款订单号',
            align: 'center'

        }, {
            field: 'currentDate',
            title: '当天日期',
            align: 'center'

        }, {
            field: 'amountCount',
            title: '退款金额',
            align: 'center'
        }
        ],
        onCheck: toolbarAsListener,
        onUncheck: toolbarAsListener,
        onCheckAll: toolbarAsListener,
        onUncheckAll: toolbarAsListener,
        onPageChange: function (number, size) {

            $(PAGE_AS_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveAll();

            toolbarAsListener();
        },

        onRefresh: function () {

            $(PAGE_AS_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveAll();

            toolbarAsListener();
        }

    };

    $(PAGE_AS_DOMS.PAGE_DATA_TABLE).initBootstrapTable(options, true);
};

var asRecoveryInitialization =function (){

    queryAsParams = {};

    $(PAGE_AS_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveAll();
};

var refreshAsTable = function(p,o){

    queryAsParams.dateTime = p;

    queryAsParams.userId = o;

    initBootstrapAsTables();

    toolbarAsListener();
};