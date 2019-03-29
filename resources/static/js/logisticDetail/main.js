var PAGE_DOMS = {
    PAGE_DATA_TABLE: '#page-data-table'
};

var PAGE_URLS = {
    GET_PAGE: contextPath + '/logisticDetail/getPage',
    GET_BY_ID: contextPath + '/logisticDetail/getById',
    QUERY_LOGISTIC_TASK: contextPath + '/logisticDetail/executeQueryLogisticTask',
    LOGISTIC_DETAIL_DLE : contextPath + '/logisticDetail/delete',
    DETAIL_TASK: contextPath + '/logisticDetail/executeSubscribeLogisticTask',
    COMPANY_GET_ALL: contextPath + '/logisticCompany/getAllLogisticCompany'
};

var msg = new Message();

var toolbarListener = function () {

    $('#toolbar button').attr('disabled', 'disabled');

    $('#toolbar #btn-batch-take').removeAttr('disabled');

    var rows = $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelections();

    var length = rows.length;

    if (length === 1) {

        var node = $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow();

        if (node.logisticType === 'LOGISTIC' && node.logisticCompany && node.logisticNo) {

            $('#toolbar #btn-query').removeAttr('disabled');

            $('#toolbar #btn-take').removeAttr('disabled');
        }

        var p = {
            id: node.id
        };

        sendQueryDetail(p);
    }
    else {

        $('#package-all').hide();

        $('#package-detail').hide();
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

            msg.show(result.errDesc);
        },
        columns: [{
            checkbox: true
        }, {
            field: 'businessOrderNo',
            title: '业务订单号',
            align: 'center'
        }, {
            field: 'packageNo',
            title: '包裹号',
            align: 'center'
        }, {
            field: 'logisticNo',
            title: '物流单号',
            align: 'center',
            formatter:function (value, row ,index) {
                return value ? value : null;
            }
        }, {
            field: 'logisticState',
            title: '物流状态',
            align: 'center',
            formatter: function (obj, row, index) {
                return constantsEnumData.logisticState[obj].name;
            }
        }, {
            field: 'logisticType',
            title: '物流类别',
            align: 'center',
            formatter: function (obj, row, index) {
                return constantsEnumData.logisticType[obj].name;
            }
        }, {
            field: 'logisticCompany',
            title: '物流公司',
            align: 'center',
            formatter: function (value, row, index) {
                return value ? value.name : null;
            }
        }, {
            field: 'orderDetail',
            title: '收货人姓名',
            align: 'center',
            formatter: function (value, row, index) {
                return value.receiverName;
            }
        }, {
            field: 'orderDetail',
            title: '收货详细地址',
            formatter: function (value, row, index) {
                return value.fullAddress;
            }
        }, {
            field: 'orderDetail',
            title: '收货人电话号码',
            align: 'center',
            formatter: function (value, row, index) {
                return value.receiverPhoneNo;
            }
        },{
            field: 'lastLogisticQueryStatus',
            title: '最后物流查询状态',
            align: 'center',
            formatter:function (obj,row,index) {
                return constantsEnumData.lastLogisticQueryStatus[obj].name;
            }
        },{
            field: 'subscribeStatus',
            title: '订阅状态',
            align: 'center',
            formatter:function (obj,row,index) {
                return constantsEnumData.subscribeStatus[obj].name;
            }
        },{
            field: 'successNum',
            title: '查询成功次数',
            align: 'center'
        },{
            field: 'failedNum',
            title: '查询失败次数',
            align: 'center'
        },{
            field: 'subscribeSuccessDatetime',
            title: '订阅成功时间',
            align: 'center'
        },{
            field: 'lastQuerySuccessDatetime',
            title: '最后查询成功时间',
            align: 'center'
        },{
            field: 'createDatetime',
            title: '物流生成时间',
            align: 'center'
        },{
            field: 'remark',
            title: '备注',
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

        $('#package-all').show();

        $('#package-display').show();

        $('#logisticFlowLines').empty();

        refreshLogisticAll(result.data);

        $('#deliveryStatus').empty();

        $('#deliverDatetime').empty();

        $('#deliveryStatus').html('<span>发货状态:</span>' + evaluation(constantsEnumData.deliveryStatus[result.data.orderPackage.deliveryStatus].name));

        $('#deliverDatetime').html('<span>发货时间:</span>' + evaluation(result.data.orderPackage.deliverDatetime));

        $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRefreshCurrentPage();

        return;
    }

    new Message().show(result.errDesc);
};

var batchCallback = function (params) {

    var result = params.result;

    if (!result) {
        return;
    }

    if (checkRespCodeSuccess(result)) {

        layer.close(params.layerIndex);

        $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableSelectFirstPage();

        return;
    }

    new Message().show(result.errDesc);
};

//判断请求后的数据格式
var evaluation = function (res) {

    if (res !== 0 ){

        var value = res ? res : '无';

        return value;
    }
    else {

        return res
    }
};

var refreshLogisticAll = function (res) {

    $('#serialNo').html('<span>序列号:</span>' + evaluation(res.orderPackage.serialNo));

    $('#packNo').html('<span>包裹号:</span>' + evaluation(res.orderPackage.packageNo));

    $('#repertory').html('<span>仓库名称:</span>' + evaluation(res.orderPackage.repertory.name));

    $('#receiverReceivingStatus').html('<span>收货人收货状态:</span>' + evaluation(constantsEnumData.receiverReceivingStatus[res.orderPackage.receiverReceivingStatus].name));

    $('#deliveryStatus').html('<span>发货状态:</span>' + evaluation(constantsEnumData.deliveryStatus[res.orderPackage.deliveryStatus].name));

    $('#packageSplitType').html('<span>分包类型:</span>' + evaluation(constantsEnumData.packageSplitType[res.orderPackage.packageSplitType].name));

    $('#totalWeight').html('<span>包裹总重量:</span>' + evaluation(res.orderPackage.totalWeight));

    $('#senderName').html('<span>发货人姓名:</span>' + evaluation(res.orderPackage.senderName));

    $('#signedDatetime').html('<span>签收时间:</span>' + evaluation(res.orderPackage.signedDatetime));

    $('#senderAddress').html('<span>发货人地址:</span>' + evaluation(res.orderPackage.senderAddress));

    $('#senderPhoneNo').html('<span>发货人电话号码:</span>' + evaluation(res.orderPackage.senderPhoneNo));

    $('#deliverDatetime').html('<span>发货时间:</span>' + evaluation(res.orderPackage.deliverDatetime));

    $('#confirmReceivedDatetime').html('<span>确认收货时间:</span>' + evaluation(res.orderPackage.confirmReceivedDatetime));

    $('#remarkDetail').html('<span>备注:</span>' + evaluation(res.orderPackage.remark));

    if(res.logisticFlowLines.length === 0) {

        $('#logisticFlowLines').append('<p>暂无</p>');
    }
    else {

        $.each(res.logisticFlowLines,function (index , row) {

            $('#logisticFlowLines').append('</br>'+'<span>时间:</span>' + evaluation(row.time) +'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+'<span>签收:</span>' + evaluation(row.context)+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + '<span>地点:</span>' + evaluation(row.location )+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;').appendTo($('#logisticFlowLines'));
        });
    }
};

function delPackageDetail() {

        var p = {
            id : $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow().id
        };

        var result = $.sendRequest(PAGE_URLS.LOGISTIC_DETAIL_DLE,JSON.stringify(p));

        if (!checkRespCodeSuccess(result)) {

            msg.show(result.errDesc);

            return;
        }

        $('#package-all').hide();

        $('#package-detail').hide();

        $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRefreshCurrentPage();
}

//请求后刷新物流和明细
var sendQueryDetail = function (params) {

    var res = $.sendRequest(PAGE_URLS.GET_BY_ID, JSON.stringify(params));

    if (!checkRespCodeSuccess(res)) {

        msg.show(res.errDesc);

        return;
    }

    $('#package-all').show();

    $('#package-detail').show();

    $('#logisticFlowLines').empty();

    refreshLogisticAll(res.data);
};

var initPageDom = function () {

    $.each(constantsEnumData.subscribeStatus, function (index, obj) {

        $('<OPTION>').val(obj.value).text(obj.name).appendTo($('#subscribe-status-list'));
    });

    $.each(constantsEnumData.logisticState, function (index, obj) {

        $('<OPTION>').val(obj.value).text(obj.name).appendTo($('#logistic-state-list'));
    });

    $.each(constantsEnumData.logisticType, function (index, obj) {

        $('<OPTION>').val(obj.value).text(obj.name).appendTo($('#logistic-detail-status'));
    });

    $.each(constantsEnumData.lastLogisticQueryStatus, function (index, obj) {

        $('<OPTION>').val(obj.value).text(obj.name).appendTo($('#last-logistic-query-status'));
    });

    $.sendRequest(PAGE_URLS.COMPANY_GET_ALL, JSON.stringify({}), {async: true}, function (result) {

        if (checkRespCodeSuccess(result)) {

            $.each(result.data, function (index, row) {

                $('<OPTION>').val(row.id).text(row.name).appendTo($('#logistic-company-list'));

            });
        }
    });

    $('#page-data-query-btn').click(function () {

        queryParams = $('#page-data-query-form').serializeJson();

        if (!queryParams.logisticState) {

            queryParams.logisticState = null
        }

        if (!queryParams.logisticType) {

            queryParams.logisticType = null
        }

        if (!queryParams.subscribeStatus) {

            queryParams.subscribeStatus = null
        }

        if (!queryParams.lastLogisticQueryStatus) {

            queryParams.lastLogisticQueryStatus = null
        }

        if (!queryParams.logisticCompany) {

            queryParams.logisticCompany = null
        }
        else {

            var company = queryParams.logisticCompany;

            delete queryParams.logisticCompany;

            queryParams.logisticCompany = {
                id : company
            }
        }

        $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableSelectFirstPage();
    });

    $('#page-package-del-btn').click(function () {

        msg.confirm("确定删除物流明细?", delPackageDetail);
    });

    $('#btn-query').click(function () {

        var p = {
            id :$(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow().id
        };

        var result = $.sendRequest(PAGE_URLS.QUERY_LOGISTIC_TASK,JSON.stringify(p));

        if (!checkRespCodeSuccess(result)) {

            msg.show(result.errDesc);

            return;
        }

        sendQueryDetail(p);
    });

    $('#btn-take').click(function () {

        var p = {
            id :$(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow().id
        };

        var result = $.sendRequest(PAGE_URLS.DETAIL_TASK,JSON.stringify(p));

        if (!checkRespCodeSuccess(result)) {

            msg.show(result.errDesc);

            return;
        }

        sendQueryDetail(p);
    });

    $('#page-package-edit-btn').click(function () {

        var callParams = {
            logisticId: $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow().id
        };

        var yesCallbackParams = {};

        new Message().openView({
            content: [contextPath + '/logisticDetail/editPage'],
            title: "编辑物流信息",
            area: ['420px', '450px']
        }, 'initPage', callParams, 'saveOrUpdate', null, editedCallback, yesCallbackParams);

    });

    $('#btn-batch-take').click(function () {

        new Message().openView({
            content: [contextPath + '/logisticDetail/batchTakePage'],
            title: "批量订阅",
            area: ['620px', '552px']
        }, 'initPage', null, 'saveOrUpdate', null, batchCallback, null);

    })
};

$(function () {

    initPageDom();

    initBootstrapTables();

    toolbarListener();

});