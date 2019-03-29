var PAGE_DOMS = {
    PAGE_DATA_TABLE: '#page-data-table'
};

var PAGE_URLS = {
    GET_PAGE: contextPath + '/channelOrder/dealTotal',

    DELETE: contextPath + '/logisticCompany/delete',

    GET_ALL_PAY_CHANNEL: contextPath + '/payChannel/getAll'
};

var toolbarListener = function () {

};

var queryParams = {};

var initBootstrapTables = function () {

    var options = {
        url: PAGE_URLS.GET_PAGE,
        toolbar: '#toolbar',
        singleSelect:true,
        // pagination:true,
        // paginationDetailHAlign:"right",
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
            field: 'currentDate',
            title: '当前日期',
            align: 'center'

        }, {
            field: 'payAmountCount',
            title: '支付总金额',
            align: 'center'
        }, {
            field: 'payNum',
            title: '支付总笔数',
            align: 'center'
        } ,{
            field: 'refundAmountCount',
            title: '退款总金额',
            align: 'center'
        }, {
            field: 'refundNum',
            title: '退款总笔数',
            align: 'center'
        }, {
            field: 'differenceValue',
            title: '入账总金额',
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
            ,range:true
            ,max:0
            ,done:function (value, date, endDate) {

                if (value !== "") {

                    var res = value.split(" ");

                    $.each(res,function (index,obj) {

                        if (index === 0) {
                            startDatetime = obj
                        }

                        if (index === 2) {
                            endDatetime = obj
                        }
                    })

                }

            }
        });
    });

    $('#page-data-query-btn').click(function () {

        var queryParam = $('#page-data-query-form').serializeJson();

        if (queryParam.startEndPayDatetime !== "") {

            delete queryParam.startEndPayDatetime;

            queryParam.startOrderDateTime = startDatetime;

            queryParam.endOrderDateTime = endDatetime;

            queryParams =queryParam;

        }
        else {

            delete queryParam.startEndPayDatetime;

            queryParam.startOrderDate = "";

            queryParam.endOrderDate = "";

            queryParams =queryParam;
        }

        $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableSelectFirstPage();
    });

    $.sendRequest(PAGE_URLS.GET_ALL_PAY_CHANNEL,JSON.stringify({}), {},function (result) {

        if (checkRespCodeSuccess(result)) {

            $.each(result.data, function (index, row) {

                $('<OPTION>').val(row.id).text(row.name).appendTo($('#pay-channel-list'));
            });
        }
    });

};

$(function () {

    initPageDom();

    initBootstrapTables();

    toolbarListener();

});