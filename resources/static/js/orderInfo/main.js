var PAGE_DOMS = {
    PAGE_DATA_TABLE: '#page-data-table'
};

var PAGE_URLS = {
    GET_PAGE: contextPath + '/orderInfo/getPage'
};

var toolbarListener = function () {

    $('#toolbar button').attr('disabled', 'disabled');

    $('#toolbar #btn-export').removeAttr('disabled');

    $('#toolbar #btn-lead').removeAttr('disabled');

    var rows = $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelections();

    var length = rows.length;

    detailRecoveryInitialization();

    if (length === 1) {

        $('#toolbar #btn-package-query').removeAttr('disabled');

        detailQueryParams.orderInfoId = rows[0].id;

        $(DETAIL_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableSelectFirstPage();

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
            field: 'businessOrderNo',
            title: '业务订单号',
            align:'center'
        }, {
            field: 'user',
            title: '用户电话',
            align: 'center',
            formatter:function (value, row, index) {
                return value ? value.phoneNo : null;
            }
        } ,{
            field: 'totalAmount',
            title: '下单总金额',
            align:'center'
        }, {
            field: 'payAmount',
            title: '支付金额',
            align:'center'
        }, {
            field: 'goodsAmount',
            title: '商品金额',
            align:'center'
        }, {
            field: 'logisticAmount',
            title: '物流运费',
            align:'center'
        }, {
            field: 'taxAmount',
            title: '税费',
            align:'center'
        }, {
            field: 'winningsAmount',
            title: '盈利金额',
            align:'center'
        }, {
            field: 'couponAmount',
            title: '优惠金额',
            align:'center'
        }, {
            field: 'specialServiceAmount',
            title: '特殊服务费用',
            align:'center'
        }, {
            field: 'useCoupon',
            title: '是否使用优惠券',
            align:'center',
            formatter:function (value, row, index) {
                return value ? "是" : "否";
            }
        }, {
            field: 'orderStatus',
            title: '订单状态',
            align:'center',
            formatter: function (obj, row, index) {
                return constantsEnumData.orderStatus[obj].name;
            }
        }, {
            field: 'orderPayStatus',
            title: '支付状态',
            align:'center',
            formatter: function (obj, row, index) {
            return constantsEnumData.orderPayStatus[obj].name;
        }
        }, {
            field: 'rebateStatus',
            title: '返利状态',
            align:'center',
            formatter: function (obj, row, index) {
                return constantsEnumData.rebateStatus[obj].name;
            }
        },{
            field: 'rebateIntegral',
            title: '返利积分',
            align:'center'
         },{
            field: 'orderPackageTotalNum',
            title: '所有包裹数量',
            align:'center'
        }, {
            field: 'notDeLiverNum',
            title: '包裹未发货的数量',
            align:'center'
        }, {
            field: 'deLiverNum',
            title: '包裹已发货的数量',
            align:'center'
        }, {
            field: 'remark',
            title: '备注',
            align:'center'
        }, {
            field: 'orderDatetime',
            title: '下单时间',
            align:'center'
        }, {
            field: 'canceledDatetime',
            title: '订单取消时间',
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

var initPageDom = function () {

    $('#export-sku').mouseenter(function () {

        layer.tips('下载符合搜索条件的订单信息', this, {
            tips: [1, '#3595CC']
        })
    });

    $('#export-sku').mouseleave(function () {

        layer.tips();
    });

    $('#export-sku').click(function () {

        var p = $('#page-data-query-form').serializeJson();

        if (p.orderStatus === "") {

            p.orderStatus=null;
        }

        if (p.orderPayStatus === "") {

            p.orderPayStatus=null;
        }

        if (p.startEndPayDatetime !== "") {

            delete p.startEndPayDatetime;

            p.startOrderDatetime = startDatetime;

            p.endOrderDatetime = endDatetime;
        }
        else {

            delete p.startEndPayDatetime;

            p.startOrderDatetime = "";

            p.endOrderDatetime = "";
        }

        $('#plt').val(JSON.stringify(p));
    });

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

    $.each(constantsEnumData.orderStatus, function (index, obj) {

        $('<OPTION>').val(obj.value).text(obj.name).appendTo($('#order-status-select'));

    });

    $.each(constantsEnumData.orderPayStatus, function (index, obj) {

        $('<OPTION>').val(obj.value).text(obj.name).appendTo($('#order-pay-status-select'));

    });

    $('#page-data-query-btn').click(function () {

        var queryParam = $('#page-data-query-form').serializeJson();

        if (queryParam.orderStatus === "") {

            queryParam.orderStatus=null;

            queryParams =queryParam;
        }

        if (queryParam.orderPayStatus === "") {

            queryParam.orderPayStatus=null;

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

    $('#btn-package-query').click(function () {

        var optHandle = $(this).attr('data-handle');

        var callParams = {
            orderInfoId: $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow().id
        };

        var yesCallbackParams = {
            viewOptHandle: optHandle
        };

        if ('package-query' === optHandle) {

            var options = {
                content: [contextPath + '/orderInfoItem/mainPage'],
                title: "查看订单包裹",
                maxmin: true,
                btn:null,
                area: ['1400px', '652px']
            };

             var index = new Message().openView(options, 'initPage', callParams, 'saveOrUpdate', null, editedCallback, yesCallbackParams);

             layer.full(index);

             return;
        }
    });
    $('#btn-export').click(function () {

        new Message().openView({
            content: [contextPath + '/orderInfoExport/editPage'],
            title: "导出未发货包裹信息",
            maxmin: true,
            btn:['关闭'],
            area: ['620px', '552px']
        });
    });

    $('#btn-lead').click(function () {

        new Message().openView({
            content: [contextPath + '/orderInfoToLead/editPage'],
            title: "导入已处理包裹信息",
            maxmin: true,
            btn:['关闭'],
            area: ['520px', '300px']
        });
    });
};

$(function () {

    initPageDom();

    initBootstrapTables();

    toolbarListener();

});