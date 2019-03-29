var ITEM_PAGE_DOMS = {
    PAGE_DATA_TABLE: '#page-item-data-table'
};

var ITEM_PAGE_URLS = {
    GET_PAGE: contextPath + '/orderInfoItem/getPage',
    PACKAGE_NUM: contextPath + '/orderPackage/getByOrderInfoId',
    LOGISTIC_DETAIL: contextPath + '/logisticDetail/getByOrderPackageId',
    ORDER_PACKAGE_GET_PAGE: contextPath + '/orderPackage/getById',
    LOGISTIC_DETAIL_DLE : contextPath + '/logisticDetail/delete'
};

var msg = new Message();

var initPage = function (params) {

    initPageDom(params);

    initFormData(params);

};

var itemQueryParams = {};

var logisticDetailId;

var initPageDom = function (params) {

    initItemPageDom(params);

    if (params.callParams.orderInfoId) {
        itemQueryParams.orderInfoId = params.callParams.orderInfoId;
    }

    initItemBootstrapTable();

    itemToolbarListener();

};

var orderInfoIdOnly;

var initFormData = function (params) {

    orderInfoIdOnly = params.callParams.orderInfoId;
};

var itemToolbarListener = function () {

    var rows = $(ITEM_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelections();

    var length = rows.length;

    optionRecoveryInitialization();

    if (length === 1) {

        refreshItem();

        $('#skuItem').show();

        optionQueryParams.orderInfoItemId = rows[0].id;

        $(OPTION_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableSelectFirstPage();
    }else {

        $('#skuItem').hide();
    }
};

var initItemBootstrapTable = function () {

    var options = {
        url: ITEM_PAGE_URLS.GET_PAGE,
        toolbar: '#toolbar-item',
        singleSelect: true,
        queryParams: function (e) {

            return JSON.stringify($.extend(itemQueryParams, {
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
        },
        {
            field: 'skuRecordNo',
            title: '备案编号'
        },
        {
            field: 'skuName',
            title: 'sku名称'
        }, {
            field: 'num',
            title: '下单个数',
            align: 'center'
        },{
            field: 'totalAmount',
            title: '订单总金额',
            align: 'center'
        }, {
            field: 'payAmount',
            title: '订单支付金额',
            align: 'center'
        }, {
            field: 'goodsAmount',
            title: '订单商品金额',
            align: 'center'
        }, {
            field: 'taxAmount',
            title: '订单税费金额',
            align: 'center'
        }, {
            field: 'specialServiceAmount',
            title: '订单特殊服务费金额',
            align: 'center'
        }, {
            field: 'couponAmount',
            title: '订单优惠金额',
            align: 'center'
        }, {
            field: 'costAmount',
            title: '订单成本金额',
            align: 'center'
        }, {
            field: 'winningsAmount',
            title: '订单盈利金额',
            align: 'center'
        }, {
            field: 'remark',
            title: '备注',
            align: 'center'
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
        }, {
            field: 'stockStatus',
            title: '库存扣减状态',
            align: 'center',
            formatter: function (value, row, index) {
                return constantsEnumData.stockStatus[value].name;
            }
        }
        ],
        onCheck: itemToolbarListener,
        onUncheck: itemToolbarListener,
        onCheckAll: itemToolbarListener,
        onUncheckAll: itemToolbarListener,
        onPageChange: function (number, size) {

            $(ITEM_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveAll();

            itemToolbarListener();
        },
        onRefresh: function () {

            $(ITEM_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveAll();

            itemToolbarListener();
        }
    };

    $(ITEM_PAGE_DOMS.PAGE_DATA_TABLE).initBootstrapTable(options, true);
};

//刷新商品明细
var refreshItem = function () {

    var params = $(ITEM_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow();

    $('#skuRecordNo').html('<span>备案编号:</span>' + evaluation(params.skuRecordNo));

    $('#spuCode').html('<span>商品编号:</span>' + evaluation(params.sku.spu.code));

    $('#skuName').html('<span>商品名称:</span>' + evaluation(params.skuName));

    var names = [];

    $.each(params.sku.skuRefGoodsAttributeOptions,function (index , o) {
        names.push(o.goodsAttribute.name+ ':'+o.goodsAttributeOption.value);
    });

    names.join(" ; ");

    $('#skuRefGoodsAttributeOptions').html('<span>属性选项:</span>' + names);

    $('#skuRecordPrice').html('<span>备案价格:</span>' + evaluation(params.skuRecordPrice));

    $('#skuCostPrice').html('<span>成本价格:</span>' + evaluation(params.skuCostPrice));

    $('#skuAgentPrice').html('<span>代理价格:</span>' + evaluation(params.skuAgentPrice));

    $('#skuRetailPrice').html('<span>零售价格:</span>' + evaluation(params.skuRetailPrice));

    $('#skuTaxPrice').html('<span>税费价格:</span>' + evaluation(params.skuTaxPrice));
};

var editedCallback = function (params) {

    var result = params.result;

    if (!result) {
        return;
    }

    if (checkRespCodeSuccess(result)) {

        layer.close(params.layerIndex);

        $('#package-all').show();

        $('#package-display').show();

        logisticDetailId = result.data.id;

        $('#logisticFlowLines').empty();

        valuationDetail(result.data);

        $('#logisticNo').empty();

        $('#logisticCompany').empty();

        $('#deliveryStatus').empty();

        $('#deliverDatetime').empty();

        $('#logisticNo').html('<span>物流编号:</span>' + evaluation(result.data.logisticNo));

        if (result.data.logisticCompany) {

            $('#logisticCompany').html('<span>物流公司:</span>' + evaluation(result.data.logisticCompany.name));

        }
        else {

            $('#logisticCompany').html('<span>物流公司:</span>' + evaluation(result.data.logisticCompany));
        }

        $('#deliveryStatus').html('<span>发货状态:</span>' + evaluation(constantsEnumData.deliveryStatus[result.data.orderPackage.deliveryStatus].name));

        $('#deliverDatetime').html('<span>发货时间:</span>' + evaluation(result.data.orderPackage.deliverDatetime));

        return;
    }

    new Message().show(result.errDesc);

};
//编辑物流界面
var editDetail = function () {

    $('#page-package-edit-btn').click(function () {

        var res = $('#item-template').find('.active').attr('id');

        var callParams = {
            orderPackageId: res
        };

        if (logisticDetailId) {
            $.extend(callParams, {
                detailId: logisticDetailId
            })
        }
        
        var yesCallbackParams = {};

        new Message().openView({
            content: [contextPath + '/orderPackageDetail/editPage'],
            title: "编辑物流信息",
            area: ['420px', '450px']
        }, 'initPage', callParams, 'saveOrUpdate', null, editedCallback, yesCallbackParams);

    })
};
//验证返回信息
var evaluation = function (res) {

    if (res !== 0 ){

        var value = res ? res : '无';

        return value;
    }
    else {

        return res
    }
};
//刷新包裹物流,添加信息
var valuationDetail = function (res) {

    $('#logisticNo').html('<span>物流编号:</span>' + evaluation(res.logisticNo));

    $('#lastQuerySuccessDatetime').html('<span>最后查询成功时间:</span>' + evaluation(res.lastQuerySuccessDatetime));

    if (res.logisticCompany) {

        $('#logisticCompany').html('<span>物流公司:</span>' + evaluation(res.logisticCompany.name));
    }
    else {

        $('#logisticCompany').html('<span>物流公司:</span>' + evaluation(res.logisticCompany));
    }

    $('#LogisticState').html('<span>最后物流查询状态:</span>' + evaluation(constantsEnumData.logisticState[res.logisticState].name));

    $('#lastLogisticQueryStatus').html('<span>最后物流查询成功状态:</span>' + evaluation(constantsEnumData.lastLogisticQueryStatus[res.lastLogisticQueryStatus].name));

    $('#successNum').html('<span>查询成功次数:</span>' + evaluation(res.successNum));

    $('#failedNum').html('<span>查询失败次数:</span>' + evaluation(res.failedNum));

    $('#queryStatusDesc').html('<span>查询状态描述:</span>' + evaluation(res.queryStatusDesc));

    $('#remark').html('<span>备注:</span>' + evaluation(res.remark));

    $('#subscribeStatus').html('<span>订阅状态:</span>' + evaluation(constantsEnumData.subscribeStatus[res.subscribeStatus].name));

    $('#subscribeSuccessDatetime').html('<span>订阅成功时间:</span>' + evaluation(res.subscribeSuccessDatetime));

    if(res.logisticFlowLines.length === 0) {

        $('#logisticFlowLines').append('<p>暂无</p>');
    }
    else {

        $.each(res.logisticFlowLines,function (index , row) {

            $('#logisticFlowLines').append('</br>'+'<span>时间:</span>' + evaluation(row.time) +'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+'<span>签收:</span>' + evaluation(row.context)+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + '<span>地点:</span>' + evaluation(row.location )+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;').appendTo($('#logisticFlowLines'));
        });
    }
};
//展示包裹明细
var packageDetailToShow =function (res) {

    $('#serialNo').html('<span>序列号:</span>' + evaluation(res.serialNo));

    $('#packNo').html('<span>包裹号:</span>' + evaluation(res.packageNo));

    $('#repertory').html('<span>仓库名称:</span>' + evaluation(res.repertory.name));

    $('#receiverReceivingStatus').html('<span>收货人收货状态:</span>' + evaluation(constantsEnumData.receiverReceivingStatus[res.receiverReceivingStatus].name));

    $('#deliveryStatus').html('<span>发货状态:</span>' + evaluation(constantsEnumData.deliveryStatus[res.deliveryStatus].name));

    $('#packageSplitType').html('<span>分包类型:</span>' + evaluation(constantsEnumData.packageSplitType[res.packageSplitType].name));

    $('#totalWeight').html('<span>包裹总重量:</span>' + evaluation(res.totalWeight));

    $('#senderName').html('<span>发货人姓名:</span>' + evaluation(res.senderName));

    $('#signedDatetime').html('<span>签收时间:</span>' + evaluation(res.signedDatetime));

    $('#senderAddress').html('<span>发货人地址:</span>' + evaluation(res.senderAddress));

    $('#senderPhoneNo').html('<span>发货人电话号码:</span>' + evaluation(res.senderPhoneNo));

    $('#deliverDatetime').html('<span>发货时间:</span>' + evaluation(res.deliverDatetime));

    $('#confirmReceivedDatetime').html('<span>确认收货时间:</span>' + evaluation(res.confirmReceivedDatetime));

    $('#remarkDetail').html('<span>备注:</span>' + evaluation(res.remark));
};
//包裹若是未发货,删除物流消息
function delPackageDetail() {

    if (logisticDetailId) {

        var p = {
            id : logisticDetailId
        };

        var result = $.sendRequest(ITEM_PAGE_URLS.LOGISTIC_DETAIL_DLE,JSON.stringify(p));

        if (!checkRespCodeSuccess(result)) {

            msg.show(result.errDesc);

            return;
        }

        refreshLogistic($('#item-template').find('.active').attr('id'));
    }
}

var refreshLogistic =function (packageId) {

    //异步请求包裹物流
    $.sendRequest(ITEM_PAGE_URLS.LOGISTIC_DETAIL,JSON.stringify({orderPackageId: packageId}),{async: true}, function (result) {

        if (!checkRespCodeSuccess(result)) {

            msg.show(result.errDesc);

            return;
        }

        $('#package-all').show();

        if (result.data) {

            $('#package-display').show();

            logisticDetailId = result.data.id;

            $('#logisticFlowLines').empty();

            valuationDetail(result.data);
        }
        else {

            logisticDetailId = null;

            $('#package-display').hide();
        }
    });
};

var initItemPageDom = function (params) {

    $('#skuItem').hide();

    $('#package-all').hide();

    $('#package-detail').hide();

    var p = {
        orderInfoId: params.callParams.orderInfoId
    };
    //请求包裹信息
    var result = $.sendRequest(ITEM_PAGE_URLS.PACKAGE_NUM, JSON.stringify(p));

    if (!checkRespCodeSuccess(result)) {

        msg.show(result.errDesc);

        return;
    }

    var res = result.data;

    $.each(res, function (index, obj) {

        var itemTemp = $('#btn-package-query').clone().attr('id', obj.id);

        itemTemp.find('SPAN').text(obj.name);

        $(itemTemp).appendTo($('#item-template'));
    });
    //全部包裹
    $('#btn-all-query').click(function () {

        $('button').removeClass('active');

        $(this).addClass('active');

        $('#package-detail').hide();

        $('#package-all').hide();

        itemQueryParams = p;

        $(ITEM_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableSelectFirstPage();
    });
    //包裹按钮事件请求包裹物流信息包裹明细
    $('#item-template button').click(function () {

        $('button').removeClass('active');

        $(this).addClass('active');

        var packageId = $(this).attr('id');

        if (packageId === 'btn-all-query') {

            return;
        }

        itemQueryParams = {
            orderPackageId: packageId
        };

        //异步请求包裹物流
        refreshLogistic(packageId);

        //异步请求包裹明细
        $.sendRequest(ITEM_PAGE_URLS.ORDER_PACKAGE_GET_PAGE,JSON.stringify({id: packageId}), {async: true}, function (obj) {

            if (!checkRespCodeSuccess(obj)) {

                msg.show(obj.errDesc);

                return;
            }

            if (obj.data) {

                $('#package-detail').show();

                packageDetailToShow(obj.data);
            }
        });

        $(ITEM_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableSelectFirstPage();
    });

    //删除物流消息
    $('#page-package-del-btn').click(function () {

        msg.confirm("确定删除物流明细?", delPackageDetail);
    });

    editDetail();
};
