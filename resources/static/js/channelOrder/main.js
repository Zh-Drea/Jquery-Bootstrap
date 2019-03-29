var PAGE_DOMS = {
    PAGE_DATA_TABLE: '#page-data-table'
};

var PAGE_URLS = {

    GET_PAGE: contextPath + '/channelOrder/getPage',

    DELETE: contextPath + '/channelOrder/delete',

    GET_ALL_PAY_CHANNEL: contextPath + '/payChannel/getAll',

    GET_BY_PAY_PAY_CHANNEL_ID: contextPath +'/payMode/getByPayChannelId'
};

var toolbarListener = function () {

    $('#toolbar button').attr('disabled', 'disabled');

    var rows = $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelections();

    var length = rows.length;

    if (length === 1) {
        $('#toolbar #btn-edit').removeAttr('disabled');
    }
    if (length > 0) {
        $('#toolbar #btn-del').removeAttr('disabled');
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
            field: 'channelOrderNo',
            title: '渠道订单号',
            align:'center'
        }, {
            field: 'orderInfo',
            title: '业务订单',
            align:'center',
            formatter:function (value, row , index) {
                return value ? value.businessOrderNo : null;
            }
        }, {
            field: 'payAmount',
            title: '支付金额',
            align:'center'
        }, {
            field: 'orderAmount',
            title: '下单金额',
            align:'center'
        }, {
            field: 'channelOrderType',
            title: '订单类型',
            align:'center',
            formatter: function (value, row, index) {
                return constantsEnumData.channelOrderType[value].name;
            }
        }, {
            field: 'channelOrderStatus',
            title: '订单状态',
            align:'center',
            formatter: function (value, row, index) {
                return constantsEnumData.channelOrderStatus[value].name;
            }
        }, {
            field: 'payChannel',
            title: '支付渠道',
            align:'center',
            formatter:function (value, row , index) {
                return value ? value.name : null;
            }
        }, {
            field: 'payMode',
            title: '支付方式',
            align:'center',
            formatter:function (value, row , index) {
                return value ? value.name : null;
            }
        }, {
            field: 'queryOrderNo',
            title: '查询订单号',
            align:'center',
            visible:false
        }, {
            field: 'payDatetime',
            title: '支付时间',
            align:'center'
        }, {
            field: 'orderDate',
            title: '订单日期',
            align:'center'
        }, {
            field: 'successDatetime',
            title: '成功时间',
            align:'center'
        }, {
            field: 'interfaceInvokeDesc',
            title: '接口调用描述',
            align:'center'
        }, {
            field: 'remark',
            title: '备注',
            align:'center'
        }, {
            field: 'originChannelOrderNo',
            title: '原渠道订单号',
            align:'center'
        }, {
            field: 'createDatetime',
            title: '创建时间',
            align:'center',
            visible:false
        }, {
            field: 'updateDatetime',
            title: '修改时间',
            align:'center',
            visible:false
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

    var optHandle = params.yesCallbackParams.viewOptHandle;

    var result = params.result;

    if (!result) {
        return;
    }

    if (checkRespCodeSuccess(result)) {

        layer.close(params.layerIndex);

        if (OPT_HANDLE.UPDATE === optHandle) {
            $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRefreshCurrentPage();
        } else {
            $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableSelectFirstPage();
        }

        return;
    }

    new Message().show(result.errDesc);
};


function deleteCallback() {

    var ids = [];

    var rows = $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelections();

    $.each(rows, function (index, row) {

        ids.push(row.id);

    });
    var params = {
        ids: ids
    };

    $.sendRequest(PAGE_URLS.DELETE, JSON.stringify(params), {async: true}, function (result) {

        if (!checkRespCodeSuccess(result)) {

            new Message().show(result.errDesc);
            return;
        }

        $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveByUniqueIds(ids, true);
    });

}

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

    $('#toolbar button').click(function () {


        var title = $(this).attr('data-title');

        var optHandle = $(this).attr('data-handle');


        if (OPT_HANDLE.DELETE === optHandle) {

            new Message().confirm('确定删除选中数据？', deleteCallback);

            return;
        }

    });

    $.each(constantsEnumData.channelOrderType, function (index, obj) {

        $('<OPTION>').val(obj.value).text(obj.name).appendTo($('#channel-order-type'));

    });

    $.each(constantsEnumData.channelOrderStatus, function (index, obj) {

        $('<OPTION>').val(obj.value).text(obj.name).appendTo($('#channel-order-status'));

    });

    //获取支付渠道
    $.sendRequest(PAGE_URLS.GET_ALL_PAY_CHANNEL, JSON.stringify({}), {}, function (result) {

        if (checkRespCodeSuccess(result)) {

            $.each(result.data, function (index, row) {

                $('<OPTION>').val(row.id).text(row.name).appendTo($('#pay-channel-list'));
            });
        }
    });
    //点击支付渠道,支付方式联动变化
    $('#pay-channel-list').change(function () {
        var p = {
            payChannelId: $(this).val()
        };

        if (p.payChannelId !== "") {

            $.sendRequest(PAGE_URLS.GET_BY_PAY_PAY_CHANNEL_ID, JSON.stringify(p), {}, function (result) {

                if (checkRespCodeSuccess(result)) {

                    $.each(result.data, function (index, row) {

                        $("#pay-mode-list").find("option").remove();

                        $("#pay-mode-list").prepend("<option value=''>请选择支付方式</option>");

                        $('<OPTION>').val(row.id).text(row.name).appendTo($('#pay-mode-list'));
                    });
                }
            });

        }
        else {

            $("#pay-mode-list").find("option").remove();

            $("#pay-mode-list").prepend("<option value=''>请选择支付方式</option>");

        }
    });

    $('#page-data-query-btn').click(function () {

        var queryParam = $('#page-data-query-form').serializeJson();

        if (queryParam.channelOrderType === "") {

            queryParam.channelOrderType=null;

            queryParams =queryParam;
        }
        if (queryParam.channelOrderStatus === "") {

            queryParam.channelOrderStatus=null;

            queryParams =queryParam;
        }
        if (queryParam.startEndPayDatetime !== "") {

            delete queryParam.startEndPayDatetime;

            queryParam.startOrderDate = startDatetime;

            queryParam.endOrderDate = endDatetime;

            queryParams =queryParam;
        }else {

            delete queryParam.startEndPayDatetime;

            queryParam.startOrderDate = "";

            queryParam.endOrderDate = "";

            queryParams =queryParam;
        }
        $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableSelectFirstPage();
    });

};

$(function () {

    initPageDom();

    initBootstrapTables();

    toolbarListener();

});