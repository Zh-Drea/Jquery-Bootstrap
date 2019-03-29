var PAGE_DOMS = {
    PAGE_DATA_TABLE: '#page-data-table'
};

var PAGE_URLS = {

    GET_PAGE: contextPath + '/refundOrderInfo/getPage'
};

var toolbarListener = function () {

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
            field: 'businessOrderNo',
            title: '退款业务订单号',
            align: 'center'

        }, {
            field: 'applyRefund',
            title: '退款用户电话',
            align: 'center',
            formatter:function (value, row, index) {
                return value ? value.user.phoneNo : null;
            }
        } ,{
            field: 'refundAmountType',
            title: '退款金额类型',
            align: 'center',
            formatter: function (obj, row, index) {
                return constantsEnumData.refundAmountType[obj].name;
            }
        }, {
            field: 'applyRefund',
            title: '退款流水号',
            align: 'center',
            formatter:function (value, row, index) {
                return value ? value.serialNo : null;
            }
        } ,{
            field: 'orderInfo',
            title: '业务订单号',
            align: 'center',
            formatter:function (value, row, index) {
                return value ? value.businessOrderNo : null;
            }
        } ,{
            field: 'refundAmount',
            title: '退款金额',
            align: 'center'
        }, {
            field: 'orderRefundStatus',
            title: '退款状态',
            align: 'center',
            formatter:function (value, row, index) {
                return constantsEnumData.orderRefundStatus[value].name;
            }
        }, {
            field: 'orderDatetime',
            title: '订单日期',
            align: 'center'
        }, {
            field: 'remark',
            title: '退款说明',
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

var initPageDom = function () {

    var startDatetime;

    var endDatetime;

    layui.use('laydate', function () {

        var laydate = layui.laydate;

        laydate.render({
            elem: '#startEndPayDatetime'
            ,type: 'datetime'
            ,range:true
            ,max:0
            ,done:function (value, date, endDate) {

                if (value !== "") {

                    var res = value.split(" ");

                    $.each(res,function (index,obj) {

                        var arr=[];

                        var endArr=[];

                        arr[0] = res[0];

                        arr[1] = res[1];

                        endArr[0] = res[3];

                        endArr[1] = res[4];

                        startDatetime = arr.join(" ");

                        endDatetime = endArr.join(" ");
                    })

                }

            }
        });
    });

    $('#page-data-query-btn').click(function () {

        var queryParam = $('#page-data-query-form').serializeJson();

        if (queryParam.refundAmountType === "") {

            queryParam.refundAmountType=null;

            queryParams =queryParam;
        }

        if (queryParam.orderRefundStatus === "") {

            queryParam.orderRefundStatus=null;

            queryParams =queryParam;
        }
        if (queryParam.startEndPayDatetime !== "") {

            delete queryParam.startEndPayDatetime;

            queryParam.startOrderDatetime = startDatetime;

            queryParam.endOrderDatetime = endDatetime;

            queryParams =queryParam;

        }else {

            delete queryParam.startEndPayDatetime;

            queryParam.startOrderDatetime = "";

            queryParam.endOrderDatetime = "";

            queryParams =queryParam;
        }

        $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableSelectFirstPage();
    });

    $.each(constantsEnumData.refundAmountType, function (index, obj) {

        $('<OPTION>').val(obj.value).text(obj.name).appendTo($('#refund-amount-select'));

    });

    $.each(constantsEnumData.orderRefundStatus, function (index, obj) {

        $('<OPTION>').val(obj.value).text(obj.name).appendTo($('#order-refund-status-select'));

    });

};

$(function () {

    initPageDom();

    initBootstrapTables();

    toolbarListener();

});