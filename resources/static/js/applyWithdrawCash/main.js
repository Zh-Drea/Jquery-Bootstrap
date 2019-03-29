var PAGE_DOMS = {
    PAGE_DATA_TABLE: '#page-data-table'
};

var PAGE_URLS = {

    GET_PAGE: contextPath + '/applyWithdrawCash/getPage'
};

var toolbarListener = function () {

    $('#toolbar button').attr('disabled', 'disabled');

    $('#toolbar #btn-add').removeAttr('disabled');

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
        },  {
            field: 'user',
            title: '用户电话',
            align: 'center',
            formatter: function (value,row,index) {
                return value ? value.phoneNo : null;
            }
        },  {
            field: 'withdrawType',
            title: '提现类型',
            align: 'center',
            formatter: function (obj, row, index) {
                return constantsEnumData.withdrawType[obj].name;
            }
        }, {
            field: 'applyWithdrawAmount',
            title: '申请提现金额',
            align: 'center'
        }, {
            field: 'deductBonusCoin',
            title: '扣除奖金币数量',
            align: 'center'
        }, {
            field: 'withdrawRate',
            title: '提现费率(千分比)',
            align: 'center'
        }, {
            field: 'transferAmount',
            title: '转账金额',
            align: 'center'
        }, {
            field: 'serviceFeeAmount',
            title: '手续费',
            align: 'center'
        }, {
            field: 'payableAmount',
            title: '应支付金额',
            align: 'center'
        }, {
            field: 'transferDatetime',
            title: '转账时间',
            align: 'center'
        }, {
            field: 'withdrawProgress',
            title: '提现进度',
            align: 'center',
            formatter: function (obj, row, index) {
                return constantsEnumData.withdrawProgress[obj].name;
            }
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

        $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRefreshCurrentPage();

        return;
    }

    new Message().show(result.errDesc);
};

var initPageDom = function () {

    $.each(constantsEnumData.withdrawType, function (index, obj) {

        $('<OPTION>').val(obj.value).text(obj.name).appendTo($('#withdraw-type-select'));
    });

    $.each(constantsEnumData.withdrawProgress, function (index, obj) {

        $('<OPTION>').val(obj.value).text(obj.name).appendTo($('#withdraw-progress-select'));
    });

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

        if (queryParam.withdrawType === "") {

            queryParam.withdrawType=null;

            queryParams =queryParam;
        }

        if (queryParam.withdrawProgress === "") {

            queryParam.withdrawProgress=null;

            queryParams =queryParam;
        }

        if (queryParam.startEndPayDatetime !== "") {

            delete queryParam.startEndPayDatetime;

            queryParam.startTransferDatetime = startDatetime;

            queryParam.endTransferDatetime = endDatetime;

            queryParams =queryParam;

        }else {

            delete queryParam.startEndPayDatetime;

            queryParam.startOrderDatetime = "";

            queryParam.endOrderDatetime = "";

            queryParams =queryParam;
        }

        $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableSelectFirstPage();
    });

    var callParams = {};

    $('#btn-edit').click(function () {

        $.extend(callParams,{
            withdrawProgress : $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow().withdrawProgress,
            id : $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow().id,
            transferAmount : $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow().transferAmount,
            transferDatetime : $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow().transferDatetime
        });

        new Message().openView({
            content: [contextPath + '/applyWithdrawCash/editPage'],
            title: '提现状态',
            area: ['500px', '360px']
        }, 'initPage', callParams, 'saveOrUpdate', null, editedCallback, null);
    });

};

$(function () {

    initPageDom();

    initBootstrapTables();

    toolbarListener();

});